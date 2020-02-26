//@ts-nocheck
import hermes from './email.controller'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { accountify } from './user.controller'
import { Account } from '../data/routes'
dotenv.config()


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

  res.redirect(accountify(Account.login))
}
