
import hermes from './email.controller'
import { Request, Response } from 'express'
import { accountify } from './user.controller'
import { Routes } from '../data/routes'


// Responsible for sending contact emails send on the contact page
export default function receiveAndSend(req: Request, res: Response) {
  const { email, name, message, reason } = req.body
  const emailData = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Support',
    template: 'contact',
    locals: { reason, message, name }
  }

  hermes.send(emailData)

  res.redirect(accountify(Routes.login))
}
