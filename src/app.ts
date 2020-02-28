import compression from 'compression';
import flash from 'connect-flash';
import cors from 'cors';
import express from 'express';
import hbs from 'express-handlebars';
import session from 'express-session';
import validator from 'express-validator';
import helmet from 'helmet';
import mongoose from 'mongoose';
import passport from 'passport';
import methodOverride from 'method-override'
import './controllers/auth.controller'; //runs passport authentication 
import config from './config/config';
import { setLocals, logger } from './config/util';
import indexRouter from './routes/index.routes';
import accountRouter from './routes/user.routes';
import path from 'path'
import 'dotenv/config'



const app = express()
const port = process.env.PORT || 3000

//@ts-ignore
mongoose.connect(process.env.DB_URL, config.dbOptions)
mongoose.connection.on('error', error => console.log(error));

app.use(compression())
app.use(cors())
app.use(methodOverride('_method'))
app.use(compression())
app.use(helmet())
app.use(session(config.sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.enable('trust proxy')


//view-engine config
app.set('view engine', 'hbs')
app.engine('hbs', hbs(config.hbsConfig))
app.set('views', path.join(__dirname, '../views'));


app.use(express.static(path.join(__dirname, "../public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(flash())
app.use(validator())
app.use(setLocals)
app.use(logger)

// routes
app.use('/', indexRouter)
app.use('/account', accountRouter)

//error 404
app.get('*', (req, res) => res.status(404).render('error404', { data: req.originalUrl }))

app.listen(port), () => console.log(`Listening at http://localhost:${port}`)


export default app