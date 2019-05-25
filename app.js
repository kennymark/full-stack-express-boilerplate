import path from 'path';
import express from 'express';
import hbs from 'express-handlebars';
import cors from 'cors';
import validator from 'express-validator';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorFormatter } from './utils/errorFormatter';
import userRouter from './routes/user.routes';
import indexRouter from './routes/index.routes';
import session from 'express-session';
import config from './utils/config';
import compression from 'compression';
import flash from 'express-flash';
import helmet from 'helmet';
import { logger } from './utils/util';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(session(config.sessionConfig));
app.use(compression());
app.use(helmet());
// app.use(logger);

mongoose
	.connect(process.env.DB_URL, { useNewUrlParser: true })
	.then(
		() => console.log('Connected to Database'),
		err => console.log('Error connecting to database')
	);

//view engineconfig
app.set('view engine', 'hbs');
app.engine('hbs', hbs(config.hbsConfig));
app.set('views', path.join('./', 'views'));
app.use('/public/', express.static('public/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(flash());
app.use(validator({ errorFormatter: errorFormatter }));

// routes
app.get('/', indexRouter);
app.use('/user', userRouter);

//error 404
app.get('*', (req, res) => res.render('error404', { data: req.originalUrl }));

app.listen(port, () => console.log(`Running at http://localhost:${port}`));
