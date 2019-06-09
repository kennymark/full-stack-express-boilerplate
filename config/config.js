import session from 'express-session'
import db from 'mongoose'
import MongoStore from 'connect-mongo'

const Store = MongoStore(session)



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
    store: new Store({
      mongooseConnection: db.connection
    })
  },

  dbOptions: {
    useNewUrlParser: true,
    useFindAndModify: false,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    keepAlive: 300000,
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