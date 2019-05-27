import user from '../models/users.model'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import moment from 'moment/moment'
import config from '../utils/config'
import _ from 'lodash'
class UserController {
	constructor() {
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

	async isAdmin(person) {
		if (person && person.admin === true) {
			const allUsers = await user.find({}).exec()
			return render('admin', { title: 'Admin', users: allUsers })
		}
	}

	parseSinglePerson(person) {
		return {
			_id: person._id,
			name: person.name,
			email: person.email,
			created_at: moment(person.created_at, 'YYYYMMDD').fromNow(),
			updated_at: moment(person.updated_at, 'YYYYMMDD').fromNow()
		}
	}

	async postUserlogin(req, res, next) {
		const { body } = req
		const { render } = res
		const person = await user.findOne({ email: body.email }).exec()
		console.log(this)

		try {
			if (!person) {
				return render('login', { error: 'User does not exist' })
			}

			if (!bcrypt.compareSync(body.password, person.password)) {
				return render('login', { title: 'Login Error', error: 'The password is invalid' })
			}
			// const data = {
			// 	_id: person._id,
			// 	name: person.name,
			// 	email: person.email,
			// 	created_at: moment(person.created_at, 'YYYYMMDD').fromNow(),
			// 	updated_at: moment(person.updated_at, 'YYYYMMDD').fromNow()
			// };
			// const token = jwt.sign(data, config.jwtSecret);
			return render('profile', {
				// data: this.parseSinglePerson.call(this, person),
				// token: token,
				title: 'Profile',
				date: moment().format('MMMM Do YYYY')
			})
		} catch (error) {
			console.error(error)
			render('login', { error })
		}
	}

	twitterLogin(req, res) {
		res.redirect('/')
	}

	async deleteUser(req, res) {
		const id = req.params.id || req.body._id
		try {
			const person = await user.findByIdAndDelete(id).exec()
			if (!person) {
				return res.render('profile', { error: 'No such person exist ' })
			}
			res.redirect('/', { message: 'Your account has been sucessfully deleted' })
		} catch (error) {}
	}

	async showEdituser(req, res) {
		const { id } = req.params
		try {
			const person = await user.findById({ _id: id }).exec()
			if (person) {
				res.render('edit-user', { data: person })
			}
		} catch (error) {
			res.render('index', { error: 'No such user found' })
		}
	}

	async updateUser(req, res) {
		const { id } = req.params
		try {
			const person = await user.findById({ _id: id }).exec()
			if (person) {
				res.render('index', { message: 'User has been sucessfully updated' })
			}
		} catch (error) {
			res.render('index', { error: 'No such user found' })
		}
	}

	logUserOut(req, res) {
		req.user = null
		res.redirect('/')
	}

	validateRequestBody(req) {}

	async postRegister(req, res) {
		const { body } = req
		const { render } = res
		req.checkBody('name', 'Name should be greater than 5 characters').isLength(5)
		req.checkBody('name', 'Name cannot be empty').isLength(5)
		req.checkBody('email', 'Email is not valid').isEmail()
		req.checkBody('password', 'Password should be greater than 5 characters').isLength(5)

		const bodyErrors = req.validationErrors()
		const foundUser = await user.findOne({ email: body.email }).exec()
		if (foundUser) {
			return render('register', {
				error: `User ${foundUser.email} already has been registered, login or reset password`
			})
		} else {
			if (bodyErrors) {
				return res.render('register', { bodyErrors })
			} else {
				try {
					body.password = bcrypt.hashSync(req.body.password, 10)
					user.create(body).then(person => {
						console.log(`New user saved sucessfully ${person.name}`)
						return render('index', { message: 'You have been sucessfully registered' })
					})
				} catch (error) {
					console.log(`Couldn't save to database`)
					render('register', { error })
				}
			}
		}
	}
}

export default new UserController()
