import mailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport';
import Email from 'email-templates'
import path from 'path'


const { SENDGRID_USERNAME, SENDGRID_API_KEY, EMAIL_FROM } = process.env

const options = {
  auth: {
    api_user: SENDGRID_USERNAME,
    api_key: SENDGRID_API_KEY
  }
}

class Hermes {

  send({ to, locals, template, subject }: Emailer) {
    const email = new Email({
      message: { from: EMAIL_FROM, },
      send: true,
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          images: true,
          relativeTo: path.resolve('public')
        },
      },
      views: { options: { extension: 'hbs' } },
      transport: mailer.createTransport(sgTransport(options)),

    });
    return email.send({ template, locals, message: { to, subject, } })
  }

}


export default new Hermes()

interface Emailer {
  to: string;
  locals: Object;
  template: string;
  subject: string;
}
