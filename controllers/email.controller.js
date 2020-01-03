import mailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import dotenv from 'dotenv'
import sgTransport from 'nodemailer-sendgrid-transport';
import inlineCss from 'nodemailer-juice'
import path from 'path'
dotenv.config({ path: '../.env' })

import exphs from 'express-handlebars'
const { SENDGRID_USERNAME, SENDGRID_API_KEY } = process.env

const log = console.log;

class Email {
  constructor() {
    this.templateConfig()
  }
  emailRoute = process.cwd() + '/email-templates'
  options = {
    auth: {
      api_user: SENDGRID_USERNAME,
      api_key: SENDGRID_API_KEY
    }
  }
  transporter = mailer.createTransport(sgTransport(this.options))

  templateConfig() {
    const config = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: `${this.emailRoutes}/partials`,
        layoutsDir: `${this.emailRoutes}/`,
        defaultLayout: `${this.emailRoutes}/main.hbs`,
      },
      viewPath: `${this.emailRoutes}/emails`,
      extName: '.hbs',
    }
    console.log(this.config)
    this.transporter.use('compile', inlineCss())
    this.transporter.use('compile', hbs(config));
  }

  send({ from, to, subject, template, context }) {
    const options = { from, to, subject, template, context }
    this.transporter.sendMail(options, (err, data) => {
      if (err) return log('Error occurs', err);
      return log('Email sent!!!', data, new Date());
    });

  }
}


export default new Email()

// const options = {
//   from: 'marthekvernvik@hotmail.com',
//   to: 'markcoffiekenneth@gmail.com',
//   subject: 'Long time no see bro',
//   template: 'welcome',
//   context: {
//     name: 'Kenny Mark',
//     company_name: 'Big Corp Inc'
//   }
// }