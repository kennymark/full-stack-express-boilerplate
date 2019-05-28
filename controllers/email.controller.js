import nodemailer from 'nodemailer'

class Email {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			auth: {
				user: 'destiny.grady@ethereal.email',
				pass: 'phrybsSYbFKr3C2WFX'
			}
		})
	}

	async send(from, to, subject, text = '', html) {
		let info = await this.transporter.sendMail({ from, to, subject, text })
		console.log('Message sent: %s', info.messageId)
	}
}
// const email = new Email()
// email.send('me@gmail.com', 'sleekykenny@outlook.com', 'hi', 'i love you boy u are the best')
export default new Email()
