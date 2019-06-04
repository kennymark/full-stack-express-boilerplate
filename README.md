# The modern Exress handlebars starter pack

This is an opinionated but yet simple and custom express applicaton that should include all the basics needs of mordern web apps. This 

[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]
[![Dependencies][dependencies]][dependencies]




## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [Requirements](#requirements)
- [Notes](#notes)
- [Packages](#packages)
- [Todo](#todo)


## Features

- Fully functional web server + web app
- Written with es6 and exNext Javascript
- Handlebars templating engine
- UI with Bootstrap 4
- User signin
- SSO auth with Google, Twitter, Facebook
- User signup
- Delete account
- Emailing with templates
- Error handling
- Relative dates with Momentjs
- Authentization
- Authorization
- Connect Mongo Session Sore
- ES6 && ESNext
- Input Validation
- Reset Password / Forgetten Password
- MVC Pattern 
- Password Reset
- Routing
- Pagination
- Incredibly modular, heck even your 
- Tests with jest


## Pages

```
- Home
- Login
- Register
- Contact
- Profile
- Forgot password
- About
- Contact
- Admin Interface
```

## Requirements
- Any decent laptop
- Mongodb local or use a service like mlab or mongodb atlas
- Nodejs
- Nodemon

## Usage

Once youo have ensure nodemon or node is started. First 
`npm i` all the packages in the terminal

Secondly ensure you have just run `npm run start` and boom there you have it. Application should be available 
on port 3000 by default but if you want to modify that behaviour add a port number in the .env file

To run tests `npm test` in the terminal 

## Notes

In production use a proper session store to store sessions in a database instead of memory which is only for local development.

[Available here](https://github.com/expressjs/session/blob/master/README.md)

- Admin Dashboard completion

## Packages



```json
"bcryptjs": "^2.4.3",
"compression": "^1.7.4",
"connect-mongo": "^2.0.3",
"cors": "^2.8.5",
"dotenv": "8.0.0",
"email-templates": "^5.1.0",
"esm": "^3.2.25",
"express": "4.17.0",
"express-flash": "^0.0.2",
"express-handlebars": "3.1.0",
"express-session": "1.16.1",
"express-validator": "5.3.1",
"helmet": "^3.18.0",
"jsonwebtoken": "8.5.1",
"lodash": "^4.17.11",
"lusca": "^1.6.1",
"moment": "^2.24.0",
"mongoose": "5.5.11",
"mongoose-paginate-v2": "^1.3.0",
"nodemailer": "^6.2.1",
"nodemailer-express-handlebars": "^3.0.0",
"passport": "^0.4.0",
"passport-google-oauth2": "^0.2.0",
"passport-local": "^1.0.0",
"passport-remember-me": "^0.0.1",
"passport-twitter": "^1.0.4"
```

## Todo

- [ ] Account deletion
- [ ] Update account
- [X] Improved error handling
- [ ] Enable view-caching in production
- [ ] Implement csrf via csurf or lusca config
- [X] Flash messages
- [ ] Emails
- [ ] Implement offline messaging support

[build]: https://travis-ci.org/kennymark/Express-starter
[build-badge]: https://travis-ci.org/kennymark/Express-starter.svg?branch=master
[license-badge]: https://img.shields.io/npm/l/@testing-library/react.svg?style=flat-square
[license]: https://github.com/IQAndreas/markdown-licenses/blob/master/mit.md
[dependencies]: https://david-dm.org/kennymark/express-starter.svg

