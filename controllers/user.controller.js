import user from '../models/users.model'
import moment from 'moment/moment'
import config from '../utils/config'
import _ from 'lodash'
import messages from '../data/messages'
import emailController from './email.controller'
import passport from 'passport'
import jwt from 'jsonwebtoken'
class UserController {
	constructor() {
		this.self = this
		if (UserController.instance == null) {
			UserController.instance = this
		}
		return UserController.instance
	}

	showLogin(req, res) {
		res.render('login', { title: 'Login' })
	}

	showProfile(req, res, next) {
		res.render('profile', { title: 'Profile' })
	}

	showRegister(req, res) {
		res.render('register', { title: 'Register' })
	}

	async confirmEmail(req, res) {
		const { id } = req.params
		const data = user.findByIdAndUpdate(id, { isConfirmed: true }).exec()
		if (person) {
			res.render('profile', { title: 'Profile', data })
		}
	}

	showforgottenPassword(req, res) {
		res.render('forgotten-password', { title: ' Forgotten password' })
	}

	async resetPassword(req, res) {
		const { email, password } = req.body
		const personemail = await user.findOne({ email })
		try {
			if (personemail) {
				await user.findOneAndUpdate({ email }, { password })
				emailController.send()
			}
		} catch (error) {
			res.render('forgotten-password', { error })
		}

		//send-email
	}

	parseSinglePerson(person) {
		return {
			_id: person._id,
			name: person.name,
			email: person.email,
			created_at: moment(person.created_at, 'YYYYMMDD').fromNow(),
			updated_at: moment(person.created_at, 'YYYYMMDD').fromNow()
		}
	}

	async searchUser(req, res) {
		try {
			const results = await user.find({ name: req.body.name }).exec()
			return res.render('admin', { title: 'Admin', users: results })
		} catch (err) {
			return res.render('admin', { title: 'Admin Error', msg: err, type: 'danger' })
		}
	}

	async searchUserById(req, res) {
		const id = req.params.id
		try {
			const results = await user.findOne({ _id: id }).exec()
			return res.render('admin', { title: 'Admin', users: results })
		} catch (err) {
			return res.render('admin', { title: 'Admin Error', msg: err, type: 'danger' })
		}
	}

	checkIfUserConfirm(person, res) {
		if (!person.isConfirmed) {
			return res.render('login', { title: 'User not', msg: message })
		}
	}

	async isAdmin(person, res) {
		if (person && person.admin === true) {
			const allUsers = await user.find({}).exec()
			return res.render('admin', { title: 'Admin', users: allUsers })
		}
	}

	async postUserlogin(req, res, next) {
		const { render } = res

		await passport.authenticate('login', { session: false }, async (err, user, info) => {
			try {
				if (err || !user) {
					onsole.log(error, info)
					return render('login', { error: messages.user_not_found })
				}
				req.login(user, { session: false }, async error => {
					if (error) return next(error)
					const body = { _id: user._id, email: user.email }
					return render('profile', {
						data: user,
						token: jwt.sign({ user: body }, config.jwtSecret),
						title: 'Profile'
					})
				})
			} catch (error) {
				return next(error)
			}
		})(req, res, next),
			console.log('auth', req.isAuthenticated())
		console.log('auth', req.user)
	}

	twitterLogin(req, res) {
		res.redirect('/')
	}

	async deleteUser(req, res) {
		const id = req.params.id || req.body._id
		const person = await user.findByIdAndDelete(id)

		if (!person) {
			return res.render('profile', { error: messages.user_not_found })
		}
		res.redirect('/', { message: messages.account_deleted })
	}

	async showEdituser(req, res) {
		const { id } = req.params
		try {
			const person = await user.findById({ _id: id })
			if (person) {
				res.render('edit-user', { data: person })
			}
		} catch (error) {
			res.render('index', { error: messages.user_not_found })
		}
	}

	async updateUser(req, res) {
		const { id } = req.params
		try {
			const person = await user.findById({ _id: id })
			if (person) {
				res.render('index', { message: messages.user_updated })
			}
		} catch (error) {
			res.render('index', { error: messages.user_not_found })
		}
	}

	logUserOut(req, res) {
		req.logout()
		res.redirect('/')
	}

	async postRegister(req, res) {
		const { render } = res
		const bodyErrors = req.validationErrors()
		if (bodyErrors) {
			return res.render('register', { bodyErrors })
		}
		passport.authenticate('signup', async (err, user, info) => {
			try {
				if (err || !user) {
					console.log(err, info)
					return render('Register', { title: 'Register', error: info.message })
				} else {
					return render('home', { title: 'Home', message: info.message })
				}
			} catch (error) {
				render('register', { error: error })
			}
		})(req, res)
	}
}

export default new UserController()
