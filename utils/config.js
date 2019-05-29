export default {
	hbsConfig: {
		defaultLayout: 'main',
		extname: '.hbs',
		layoutsDir: './views/layouts',
		partialsDir: './views/partials'
	},
	sessionConfig: {
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true
		// cookie: { secure: true }
	},
	jwtSecret: 'lol im a big man',
	jwtOptions: {
		expiresIn: '2 days',
		issuer: 'Kenny Mark'
	}
}
