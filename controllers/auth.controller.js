import passport from 'passport'
import LocalStrategy from 'passport-local'
import TwiterStrategy from 'passport-twitter'
import GoogleStrategy from 'passport-google-oauth2'
import FacebookStrategy from 'passport-facebook'
import GithubStrategy from 'passport-github'
import dotenv from 'dotenv'

const { Strategy: localStrategy } = LocalStrategy
const { Strategy: twitterStrategy } = TwiterStrategy
const { Strategy: googleStrategy } = GoogleStrategy
const { Strategy: facebookStrategy } = FacebookStrategy
const { Strategy: githubStrategy } = GithubStrategy



dotenv.config()
  // console.log(process.env)
import user from '../models/user.model'
import messages from '../data/messages'

//passport middle to handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async(req, email, password, done) => {
  try {
    const { name } = req.body
    const userExists = await user.findOne({ email })
    if (userExists) {
      done(null, false, { message: messages.userAlreadyExists(userExists) })
    } else if (!userExists) {
      const person = await user.create({ email, password, name })
      return done(null, person, { message: messages.account_registered })
    }
  } catch (error) {
    done(error)
  }
}))

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async(email, password, done) => {
  try {
    const person = await user.findOne({ email })
    if (!person) {
      return done(null, false, { message: messages.user_not_found })
    }
    if (await !user.isValidPassword(password)) {
      return done(null, false, { message: messages.invalid_password })
    } else {
      return done(null, person, { message: messages.account_registered })
    }
  } catch (error) {
    return done(error)
  }
}))

passport.use('twitter', new twitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWIITER_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {

  const person = await user.findOne({ twitterId: profile.id })
  if (person) done(null, person, { message: messages.login_sucess })
  else {
    const twitterUser = {
      twitterId: profile.id,
      email: profile.username + '@twitter.com',
      name: profile.displayName,
      provider: profile.provider,
      gender: profile.gender,
      website: profile._json.url
    }
    const newUser = await user.create(twitterUser)
    return done(null, newUser, { message: messages.account_registered })
  }


}))

passport.use('google', new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {

  const person = await user.findOne({ googleId: profile.id })
  if (person) return done(null, person, { message: messages.login_sucess })
  else {
    const googleUser = {
      googleId: profile.id,
      email: profile.email,
      name: profile.displayName,
      provider: profile.provider,
    }
    const newUser = await user.create(googleUser)
    return done(null, newUser, { message: messages.account_registered })
  }
}));


passport.use('facebook', new facebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL
}, async(token, refreshToken, profile, done) => {
  const person = await user.findOne({ facebookId: profile.id })
  if (person) return done(null, person, { message: messages.login_sucess })
  else {
    const fbUser = {
      facebookId: profile.id,
      name: profile.name,
      provider: profile.provide,
      gender: profile.gender,
      email: profile.username + '@facebook.com',
      website: profile._json.url
    }

    const newUser = await user.create(fbUser)
    return done(null, newUser, { message: messages.account_registered })
  }
}))

passport.use('github', new githubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  }, async(token, refreshToken, profile, done) => {
    console.log(profile)
    const person = await user.findOne({ githubId: profile.id })
    if (person) return done(null, person, { message: messages.login_sucess })
    else {
      const githubUser = {
        githubId: profile.id,
        name: profile.displayName,
        provider: profile.provider,
        gender: profile.gender,
        email: profile.username + '@github.com',
        website: profile.profileUrl
      }
      const newUser = await user.create(githubUser)
      return done(null, newUser, { message: messages.account_registered })
    }
  }))
  // used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user)
  })
})

export default passport