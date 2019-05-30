import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const { SENDGRID_USERNAME, SENDGRID_API_KEY } = process.env
const log = console.log;

class Email {
	constructor() {
		this.options = {
			service: 'sengrid',
			auth: {
				api_user: SENDGRID_USERNAME,
				api_key: SENDGRID_API_KEY
			}
		}
		this.transporter = nodemailer.createTransport(this.options)
		this.transport()
	}

	transport() {
		// const options = {
		// 	viewEngine: {
		// 		extName: '.hbs',
		// 		partialsDir: '../templates/partials/',
		// 		layoutsDir: '../templates/emails',
		// 		// defaultLayout: 'email.body.hbs',
		// 	},
		// 	viewPath: '../templates/emails',
		// 	extName: '.hbs',
		// }
		this.transporter.use('compile', hbs({
			viewEngine: 'express-handlebars',
			viewPath: './../templates/emails',
			partialsDir: '../templates/partials/',
			extName: '.hbs',
		}));
	}

	emailOptions = () => {
		return {
			from: 'kennymark14@gmail.com',
			to: 'geniounico@outlook.com',
			subject: 'Long time no see bro',
			template: 'welcome',
			context: {
				name: 'Kenny Mark',
				company_name: 'Big Corp Inc'
			}
		}
	}

	async send() {
		this.transporter.sendMail(this.emailOptions, (err, data) => {
			if (err) return log('Error occurs');

			return log('Email sent!!!');
		});
	}
}


// const email = new Email()
// email.send()


export default new Email()
