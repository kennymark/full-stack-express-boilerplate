//@ts-nocheck
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
  passwordField: 'password',
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

passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
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
  callbackURL: process.env.TWIITER_CALLBACK_URL
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ twitterId: profile.id })
  if (user) return done(null, user, { message: messages.login_sucess })
  socialStrategy(user, 'twitter')
}))

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ googleId: profile.id })
  socialStrategy(user, 'google')
}));


passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL
}, async (token: string, refreshToken, profile, done) => {
  const user = await userModel.findOne({ facebookId: profile.id })
  socialStrategy(user, 'facebook')

}))

passport.use('github', new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ githubId: profile.id })
  socialStrategy(user, 'github')
}))


function socialStrategy(user, service) {
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

// used to serialize the user for the session
passport.serializeUser((user, done) => done(null, user.id))

// used to deserialize the user
passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    done(err, user)
  })
})

export default passport