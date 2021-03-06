
import session from 'express-session'
import db from 'mongoose'
import MongoStore from 'connect-mongo'

const Store = MongoStore(session)


export default {
  hbsConfig: {
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      math: function (lvalue: any, operator: any, rvalue: any) {
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
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
    saveUninitialized: false,
    store: new Store({
      mongooseConnection: db.connection
    })
  },

  dbOptions: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    keepAlive: 300000,
  },

  jwtSecret: 'God bless america',
  jwtOptions: {
    expiresIn: '2 days',
    issuer: 'Kenny Mark'
  }
}