import mailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import dotenv from 'dotenv'
import sgTransport from 'nodemailer-sendgrid-transport';
import inlineCss from 'nodemailer-juice'
import path from 'path'
import email from 'email-templates'

dotenv.config({ path: '../.env' })


const { SENDGRID_USERNAME, SENDGRID_API_KEY } = process.env

const log = console.log;

const options = {
  auth: {
    api_user: SENDGRID_USERNAME,
    api_key: SENDGRID_API_KEY
  }
}
class Hermes {
  constructor() {
    this.transporter = mailer.createTransport(sgTransport(options))
    this.templateConfig()
    this.emailRoute = __dirname + '/email-templates'
  }

  templateConfig() {
    const config = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: path.join(__dirname, '../email-templates', 'partials/'),
        layoutsDir: path.join(__dirname, '../email-templates'),
        defaultLayout: path.join(__dirname, '../email-templates', 'main.hbs'),
      },
      viewPath: path.join(__dirname, '../email-templates', 'emails'),
      extName: '.hbs',
    }
    this.transporter.use('compile', inlineCss())
    this.transporter.use('compile', hbs(config));
  }

  send({ from, to, subject, template, context }) {
    const options = { from, to, subject, template, context }
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (err) return reject(`email sending occurs ${err}`);
        if (data) {
          log(data, new Date())
          resolve('Email sent!!!')
        }
      });
    })
  }
}


export default new Hermes()
