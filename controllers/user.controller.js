import user from '../models/users.model';
import jwt from './jwt';
import bcrypt from 'bcryptjs';
import moment from 'moment/moment';

class UserController {
	now = moment();
	showLogin(req, res) {
		res.render('login', { title: 'Login' });
	}

	showProfile(req, res, next) {
		res.render('profile', { title: 'Profile' });
	}

	showRegister(req, res) {
		res.render('register', { title: 'Register' });
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
		try {
			const person = await user.findOne({ email: body.email }).exec();
			// console.log('person', new Date(), person);
			if (!person) {
				return res.render('login', { error: 'User does not exist' });
			}
			if (person.isAdmin === true) {
				const allUsers = await user.find({}).exec();
				console.log(allUsers);
				return res.render('admin', { title: 'Admin', users: allUsers });
			}
			if (!bcrypt.compareSync(body.password, person.password)) {
				return res.render('login', { error: 'The password is invalid' });
			}
			res.render('profile', { person, date: this.now.format('MMMM Do YYYY') });
		} catch (error) {
			res.render('login', { error });
		}
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
			const person = await user.findByIdAndDelete(id).exec();
		} catch (error) {}
	}

	logUserOut(req, res) {
		req.user = null;
		res.redirect('/');
	}

	async postRegister(req, res, next) {
		const { body } = req;
		req.checkBody('name', 'Name should be greater than 5 characters').isLength(5);
		req.checkBody('name', 'Name cannot be empty').isLength(5);
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password should be greater than 5 characters').isLength(5);

		const errors = req.validationErrors();
		console.log(errors);

		try {
			body.password = bcrypt.hashSync(req.body.password, 10);
			const User = new user(body);
			User.save().then(person => {
				console.log(`New user saved sucessfully ${person.name}`);
				return res.render('index', { message: 'You have been sucessfully registered' });
			});
		} catch (error) {
			console.log(`Couldn't save to database`);
			res.render('register', { error });
		}
	}
}

export default new UserController();
