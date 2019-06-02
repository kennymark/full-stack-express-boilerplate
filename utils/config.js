import session from 'express-session'
import env from 'dotenv'
import MongoStore from 'connect-mongo'

const Store = MongoStore(session)
env.config()


export default {
  hbsConfig: {
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      math: function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
        }[operator];
      }
    }
  },

  sessionConfig: {
    secret: 'keyboard cat',
    resave: false,
    key: 'sid',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    cookie: { secure: false },
    store: new Store({ url: process.env.DB_URL, })
  },

  luscaConfig: {
    // csrf: true,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
  },

  jwtSecret: 'God bless america',
  jwtOptions: {
    expiresIn: '2 days',
    issuer: 'Kenny Mark'
  }
}