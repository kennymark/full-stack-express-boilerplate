import passport from 'passport'
import LocalStrategy from 'passport-local'
import TwiterStrategy from 'passport-twitter'
import dotenv from 'dotenv'
const { Strategy: localStrategy } = LocalStrategy
import user from '../models/users.model'
import messages from '../data/messages'

//passport middle to handle user registration
passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			req.checkBody('name', 'Name should be greater than 5 characters').isLength(5)
			req.checkBody('name', 'Name cannot be empty').notEmpty()
			req.checkBody('email', 'Email is not valid').isEmail()
			req.checkBody('password', 'Password should be greater than 5 characters').isLength(5)
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
		}
	)
)

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
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
		}
	)
)
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
