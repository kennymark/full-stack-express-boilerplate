import express from 'express'
import hbs from 'express-handlebars'
import cors from 'cors'
import validator from 'express-validator'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { errorFormatter } from './utils/errorFormatter'
import session from 'express-session'
import config from './utils/config'
import compression from 'compression'
import flash from 'express-flash'
import helmet from 'helmet'
import passport from 'passport'
import lusca from 'lusca'
import passportConfig from './controllers/auth.controller'

dotenv.config()

//user routes
import userRouter from './routes/user.routes'
import indexRouter from './routes/index.routes'
import { logger, setLocals } from './utils/util'

const app = express()
const port = process.env.PORT || 8000

app.use(compression())
app.use(helmet())
app.use(session(config.sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(lusca(config.luscaConfig))
app.use(logger)

mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env.DB_URL)

//view engineconfig
app.set('view engine', 'hbs')
app.engine('hbs', hbs(config.hbsConfig))
app.use('/public/', express.static('public/'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())
app.use(flash())
app.use(validator({ errorFormatter: errorFormatter }))
app.use(setLocals)
// routes
app.use('/', indexRouter)
app.use('/user', userRouter)

//error 404
app.get('*', (req, res) => res.render('error404', { data: req.originalUrl }))

app.listen(port, () => console.log(`Running at http://localhost:${port}`))

export default app
