# Simple Exress handlebars starter pack

This is a custom express + handlebars starter pack I use for simple applications

## Table of Contents

- [Features](#features)
- [Pages](#features)
- [Requirements](#requirements)
- [Notes](#notes)
- [Packages](#packages)
- [Todo](#todo)

## Pages

---

- Home
- Login
- Register
- Contact
- Profile
- Forgot password
- About
- Contact
- Admin Interface

## Features

---

- Fully functional web server + web app
- Handlebars templating engine
- UI with Bootstrap 4
- User signin
- User signup
- Delete account
- Emailing with templates
- Error handling
- Momentjs
- Authentization
- Authorization
- ES6 && ESNext
- Input Validation
- Tests
- Reset Password / Forgetten Password
- MVC Project Structure

## Requirements

---

In order to use this application, there are a few applications

**Install**

- Mongodb local or use a service like mlab or mongodb atlas
- Nodejs
- Nodemon

## Usage

---

## Notes

In production use a proper session store to store sessions in a database instead of memory which is only for local development.

[Available here](https://github.com/expressjs/session/blob/master/README.md)

- Admin Dashboard completion

## Packages

---

```json
		"bcryptjs": "^2.4.3",
		"compression": "^1.7.4",
		"cors": "^2.8.5",
		"dotenv": "8.0.0",
		"email-templates": "^5.1.0",
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
		"nodemailer": "^6.2.1",
		"nodemailer-express-handlebars": "^3.0.0",
		"nodemailer-sendgrid-transport": "^0.2.0",
		"passport": "^0.4.0",
		"passport-local": "^1.0.0",
		"passport-twitter": "^1.0.4"
```

## Todo

---

- Account deletion
- Proper error handling
- Include at least one oauth provider
