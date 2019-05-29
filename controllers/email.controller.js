import nodemailer from 'nodemailer'
import sendGridTransporter from 'nodemailer-sendgrid-transport'
import hbs from 'nodemailer-express-handlebars'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const { SENDGRID_USERNAME, SENDGRID_API_KEY } = process.env

class Email {
	constructor() {
		this.options = {
			auth: {
				api_user: SENDGRID_USERNAME,
				api_key: SENDGRID_API_KEY
			}
		}
		this.transporter = nodemailer.createTransport(sendGridTransporter(this.options))
	}

	async send({ from, to, subject, text = '', html }) {
		let info = await this.transporter.sendMail({ from, to, subject, text })
		console.log('Message sent: %s', info)
	}
}

// const email = new Email()

export default new Email()
