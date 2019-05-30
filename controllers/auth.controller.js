import passport from 'passport'
import LocalStrategy from 'passport-local'
import TwiterStrategy from 'passport-twitter'
import GoogleStrategy from 'passport-google-oauth2'
import dotenv from 'dotenv'

const { Strategy: localStrategy } = LocalStrategy
const { Strategy: twitterStrategy } = TwiterStrategy
const { Strategy: googleStrategy } = GoogleStrategy


dotenv.config()
// console.log(process.env)
import user from '../models/user.model'
import messages from '../data/messages'

//passport middle to handle user registration
passport.use('signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {
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
}, async (email, password, done) => {
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
}, async (token, refreshToken, profile, done) => {
	const user = await user.findById({ _id: profile.id })

	if (!user) {
		const twitterUser = {
			_id: profile.id,
			email: profile.email + '@twitter.com',
			name: profile.name,
			provider: 'twitter'
		}
		const newUser = await user.create(twitterUser)
		done(null, newUser)
	}

}))


passport.use('google', new googleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (token, refreshToken, profile, done) => {
	console.log(token, profile)

	const user = await user.findById({ _id: profile.id })
	if (!user) {
		const googleUser = {
			_id: profile.id,
			email: profile.email,
			name: profile.name,
			provider: profile.provider
		}
		const newUser = await user.create(googleUser)

		done(null, newUser, { message: messages.login_sucess })
	}

}))


// used to serialize the user for the session
passport.serializeUser(function (user, done) {
	done(null, user._id)
})

// used to deserialize the user
passport.deserializeUser(function (id, done) {
	user.findById(id, function (err, user) {
		done(err, user)
	})
})

export default passport
