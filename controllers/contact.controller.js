import email from './email.controller'
import dotenv from 'dotenv'

dotenv.config()

export default {
  receiveAndSend(req, res) {
    const { email, name, message, reason } = res.body
    const emailData = {
      from: email,
      to: process.env.EMAIL,
      subject: 'Support',
      template: 'contact',
      context: { reason, message, name }
    }

    email.send(emailData)

    res.redirect(req.baseUrl)
  }
}