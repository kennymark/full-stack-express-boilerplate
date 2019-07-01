import compression from 'compression';
import flash from 'connect-flash';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import hbs from 'express-handlebars';
import session from 'express-session';
import validator from 'express-validator';
import helmet from 'helmet';
import lusca from 'lusca';
import mongoose from 'mongoose';
import passport from 'passport';
import morgan from 'morgan'
import methodOverride from 'method-override'
import './controllers/auth.controller'; //runs passport authentication 
import config from './config/config';
import { setLocals } from './config/util';
import indexRouter from './routes/index.routes';
import userRouter from './routes/user.routes';

dotenv.config()


const app = express()
const port = process.env.PORT || 3000


mongoose.connect(process.env.DB_URL, config.dbOptions)
mongoose.connection.on('error', error => console.log(error));

app.use(cors())
app.use(methodOverride('_method'))
app.use(compression())
app.use(helmet())
app.use(session(config.sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(lusca(config.luscaConfig))
app.use(morgan('short'))
app.enable('trust proxy')


//view engineconfig
app.set('view engine', 'hbs')
app.engine('hbs', hbs(config.hbsConfig))


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(flash())
app.use(validator())
app.use(setLocals)

// routes
app.use('/', indexRouter)
app.use('/user', userRouter)

//error 404
app.get('*', (req, res) => res.render('error404', { data: req.originalUrl }))

process.env.NODE_ENV.includes('prod') ? app.set('view cache', true) : app.set('view cache', false)

app.listen(port)
  .on('listening', async () => {
    await console.log(`Listening at http://localhost:${port}`)
  })


export default app