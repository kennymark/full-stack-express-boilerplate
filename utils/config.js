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
		saveUninitialized: false,
		cookie: { secure: false }
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
