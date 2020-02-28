import mailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport';
import Email from 'email-templates'
import path from 'path'


const { SENDGRID_USERNAME, SENDGRID_API_KEY, EMAIL_FROM, NODE_ENV } = process.env



// The central nerve system for sending emails across the application
class Hermes {

  private options = {
    auth: {
      api_user: SENDGRID_USERNAME,
      api_key: SENDGRID_API_KEY
    }
  }

  send({ to, locals, template, subject }: Emailer) {
    const email = new Email({
      message: { from: EMAIL_FROM, },
      send: NODE_ENV === 'production' ? true : false,
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          images: true,
          relativeTo: path.resolve('public')
        },
      },
      views: { options: { extension: 'hbs' } },
      transport: mailer.createTransport(sgTransport(this.options)),

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
