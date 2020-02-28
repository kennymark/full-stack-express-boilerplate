import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GithubStrategy } from 'passport-github'
import userModel from '../models/user.model'
import messages from '../data/messages'
import 'dotenv/config'



//passport middle to handle user registration
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const { name } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
      return done(null, false, { message: messages.userAlreadyExists(user) })
    } else {
      const newUser = await userModel.create({ email, password, name })
      return done(null, newUser, { message: messages.account_registered })
    }
  } catch (error) {
    done(error)
  }
}))

// Logs user in locally
passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await userModel.findOne({ email })
  if (!user) {
    return done(null, false, { message: messages.user_not_found });
  }
  else {
    const isValid = await user.validatePassword(password)
    if (isValid) return done(null, user, { message: messages.login_sucess });
    return done(null, false, { message: messages.invalid_password });
  }
}));

passport.use('twitter', new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: getDevProdCallbackUrl('twitter')
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ twitterId: profile.id })
  executeSocialStrategy(user, 'twitter', done, profile)
}))

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: getDevProdCallbackUrl('google')
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ googleId: profile.id })
  executeSocialStrategy(user, 'google', done, profile)
}));


passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: getDevProdCallbackUrl('facebook')
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ facebookId: profile.id })
  executeSocialStrategy(user, 'facebook', done, profile)

}))

passport.use('github', new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: getDevProdCallbackUrl('github'),
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ githubId: profile.id })
  executeSocialStrategy(user, 'github', done, profile)
}))


async function executeSocialStrategy(user, service, done, profile) {
  if (user) return done(null, user, { message: messages.login_sucess })
  else {
    const account = {
      name: profile.displayName,
      provider: profile.provider,
      gender: profile.gender,
      email: `${profile.name}@${service}.com`,
      website: profile._json.url
    }
    account[`${service}Id`] = profile.id
    const newUser = await userModel.create(account)
    return done(null, newUser, { message: messages.account_registered })
  }
}

function getDevProdCallbackUrl(service: string) {
  if (process.env.NODE_ENV.includes('development')) {
    return `http://localhost:3000/oauth/${service}`
  } else {
    return `https://express-kenny.herokuapp.com/auth/${service}`
  }
}

// used to serialize the user for the session
passport.serializeUser((user: UserDoc, done) => done(null, user.id))

// used to deserialize the user for when u want to use req.user
passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => done(err, user))
})

interface UserDoc {
  id: string
}

export default passport