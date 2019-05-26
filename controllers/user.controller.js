import user from '../models/users.model';
import jwt from './jwt';
import bcrypt from 'bcryptjs';
import moment from 'moment/moment';

class UserController {
	now = moment;
	showLogin(req, res) {
		res.render('login', { title: 'Login' });
	}

	showProfile(req, res, next) {
		res.render('profile', { title: 'Profile' });
	}

	showRegister(req, res) {
		res.render('register', { title: 'Register' });
	}

	transformUsers(item) {
		return (item.created_at = moment(item.created_at, 'YYYYMMDD').fromNow());
	}

	async isAdmin(person, res) {
		if (person.isAdmin === true) {
			const allUsers = await user.find({}).exec();
			console.log(allUsers);
			return res.render('admin', { title: 'Admin', users: allUsers });
		}
	}

	async postUserlogin(req, res, next) {
		const { body } = req;
		const { render } = res;
		try {
			const person = await user.findOne({ email: body.email }).exec();
			if (!person) {
				return render('login', { error: 'User does not exist' });
			}
			if (person.isAdmin === true) {
				const allUsers = await user.find({}).exec();
				console.log(allUsers);
				return render('admin', { title: 'Admin', users: allUsers });
			}
			if (!bcrypt.compareSync(body.password, person.password)) {
				return render('login', { error: 'The password is invalid' });
			}
			render('profile', { person, date: moment().format('MMMM Do YYYY') });
		} catch (error) {
			render('login', { error });
		}
	}

	twitterLogin(req, res) {
		res.redirect('/');
	}

	async deleteUser(req, res) {
		const id = req.params._id || req.body._id;
		try {
			const person = await user.findByIdAndDelete(id).exec();
			if (!person) {
				return res.render('profile', { error: 'No such person exist ' });
			}
			res.redirect('/', { message: 'Your account has been sucessfully' });
		} catch (error) {}
	}

	async updateUser(req, res) {
		const id = req.body.id || req.params.id;
		try {
			const person = await user.findByIdAndUpdate(id, req.body).exec();
			if (person) {
				res.render('index', { message: 'User has been sucessfully updated' });
			}
		} catch (error) {}
	}

	logUserOut(req, res) {
		req.user = null;
		res.redirect('/');
	}

	validateRequestBody(req) {}

	async postRegister(req, res, next) {
		const { body } = req;
		const { render } = res;
		req.checkBody('name', 'Name should be greater than 5 characters').isLength(5);
		req.checkBody('name', 'Name cannot be empty').isLength(5);
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password should be greater than 5 characters').isLength(5);
		// this.validateRequestBody(req);
		const bodyErrors = req.validationErrors();
		const foundUser = await user.findOne({ email: body.email }).exec();
		if (foundUser) {
			return render('register', {
				error: `User ${foundUser.email} already has been registered, login or reset password`
			});
		} else {
			if (bodyErrors) {
				return res.render('register', { bodyErrors });
			} else {
				try {
					body.password = bcrypt.hashSync(req.body.password, 10);
					user.create(body).then(person => {
						console.log(`New user saved sucessfully ${person.name}`);
						return render('index', { message: 'You have been sucessfully registered' });
					});
				} catch (error) {
					console.log(`Couldn't save to database`);
					render('register', { error });
				}
			}
		}
	}
}

export default new UserController();
