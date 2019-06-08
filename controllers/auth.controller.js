import passport from 'passport'
import LocalStrategy from 'passport-local'
import TwiterStrategy from 'passport-twitter'
import GoogleStrategy from 'passport-google-oauth2'
import FacebookStrategy from 'passport-facebook'
import GithubStrategy from 'passport-github'
import dotenv from 'dotenv'
import userModel from '../models/user.model'
import messages from '../data/messages'
dotenv.config()

const { Strategy: localStrategy } = LocalStrategy
const { Strategy: twitterStrategy } = TwiterStrategy
const { Strategy: googleStrategy } = GoogleStrategy
const { Strategy: facebookStrategy } = FacebookStrategy
const { Strategy: githubStrategy } = GithubStrategy

//passport middle to handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async(req, email, password, done) => {
  try {
    const { name } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
      done(null, false, { message: messages.userAlreadyExists(user) })
    } else {
      const newUser = await userModel.create({ email, password, name })
      return done(null, newUser, { message: messages.account_registered })
    }
  } catch (error) {
    done(error)
  }
}))

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async(email, password, done) => {

  const user = await userModel.findOne({ email })
  try {
    const validate = await user.isValidPassword(password);
    if (!user) {
      return done(null, false, { message: messages.user_not_found })
    }
    if (!validate) {
      return done(null, false, { message: messages.invalid_password })
    }
    return done(null, user, { message: messages.account_registered })
  } catch (err) {
    return done(err, false, );
  }
}))

passport.use('twitter', new twitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWIITER_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ twitterId: profile.id })
  if (user) return done(null, user, { message: messages.login_sucess })
  else {
    const twitterUser = {
      twitterId: profile.id,
      email: profile.username + '@twitter.com',
      name: profile.displayName,
      gender: profile.gender,
      provider: profile.provider,
    }
    const newUser = await userModel.create(twitterUser)
    return done(null, newUser, { message: messages.account_registered })
  }

}))

passport.use('google', new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {

  const user = await userModel.findOne({ googleId: profile.id })
  if (user) return done(null, user, { message: messages.login_sucess })
  else {
    const googleUser = {
      googleId: profile.id,
      email: profile.email,
      name: profile.displayName,
      gender: profile.gender,
      provider: profile.provider,
    }
    const newUser = await userModel.create(googleUser)
    return done(null, newUser, { message: messages.account_registered })
  }
}));


passport.use('facebook', new facebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {
  const user = await userModel.findOne({ facebookId: profile.id })
  if (user) return done(null, user, { message: messages.login_sucess })
  else {
    const fbUser = {
      facebookId: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      gender: profile.gender,
      email: profile.username + '@facebook.com',
      website: profile._json.url
    }

    const newUser = await userModel.create(fbUser)
    return done(null, newUser, { message: messages.account_registered })
  }
}))

passport.use('github', new githubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async(token, refreshToken, profile, done) => {

  const user = await userModel.findOne({ githubId: profile.id })

  if (!user) return done(null, user, { message: messages.login_sucess })
  else {
    const githubUser = {
      githubId: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      gender: profile.gender,
      email: profile.username + '@github.com',
      website: profile.profileUrl
    }
    const newUser = await userModel.create(githubUser)
    return done(null, newUser, { message: messages.account_registered })
  }
}))


// used to serialize the user for the session
passport.serializeUser((user, done) => done(null, user.id))

// used to deserialize the user
passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    done(err, user)
  })
})

export default passport