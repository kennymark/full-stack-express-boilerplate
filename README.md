# The Exress handlebars starter pack

This is an opinionated but yet simple and custom express applicaton that should include all the basics needed in mordern web apps. 
This application is created to be fast,secure, modular and incredibly extensibly. 

[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]
[![Dependencies][dependencies]][dependencies]




## Table of Contents
-----------------------

- [Features](#features)
- [Pages](#pages)
- [Requirements](#requirements)
- [Notes](#notes)
- [Project Structure](#projectstructure)
- [Packages](#packages)
- [Todo](#todo)


## Features
------------
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
--------
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
---------------
- Any decent laptop
- Mongodb local or use a service like mlab or mongodb atlas
- Nodejs
- Nodemon
- Some prior node, express and JS knowledge, especially the es6 syntax, classes, import modules etc

## Usage
--------
Once youo have ensure nodemon or node is started. First 
`npm i` all the packages in the terminal

Secondly ensure you have just run `npm run start` and boom there you have it. Application should be available 
on port 3000 by default but if you want to modify that behaviour add a port number in the .env file

To run tests `npm test` in the terminal 

## Project Structure
--------------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **__tests__**/                     | Contains tests files used in the application                 |
| **config**/config.js               | Contains config for packages being used in the application   |
| **controllers**/auth.controller.js | Passport Local and OAuth strategies, plus login middleware.  |
| **controllers**/email.controller.js| Controller for emails                                        |
| **controllers**/index.controller.js| Controller for index routes                                  |
| **controllers**/user.controller.js | Controller for user account management and views             |
| **data**/messages.js               | Stores flash messages used across the application            |
| **email-templates**/'              | All emails to be used across the application                 |
| **models**/user.model.js           | Mongoose schema for user model                               |
| **models**/comments.model.js       | Contains dummy comment schema does thats not used here       |
| **public**/                        | Static assets (fonts, css, js, img).                         |
| **routes**/index.routes.js         | Router for handling index routes                             |
| **routes**/user.routes.js          | Has a a list of routes pertaining to a user                  |
| **views/api**/                     | Templates for API Examples.                                  |
| **views/partials**/                | Contains handlebars partials for footer,header and flash     |
| **views**/                         | All your views should be found here                          |
| **.env**/                          | All secrets keys for oauth providers, db_url and app port    |
| *app.js*                             | Main application file.                                      |


## Notes
---------
### Session Store
In production ensure you are using own session store. This application uses connect mongo by default, if you do not like that. You can change it in the config file in the utils folders. There are a lot of session stores out there some of which could be found [here](https://github.com/expressjs/session/blob/master/README.md)


### Auth 
If you want to use one the auth service providers please ensure that you have the correct credentials as demonstrated in the .env file. Also also ensure yoou have set up an app for the correct provider in the developer service for said provider..

### Emails
Emailing for this appplication is fairly simple to implement. Emails should be written in handlebars with the `.hbs` extension in the emails-templates/emails folder. Just write whatever you wanna write, and wrap the dynamic data in double curly brackets `{{}}` as its done in handlebars. 
**Send an email**

```js
var email = require('./controllers/email.controller.js')

const emailOptions =  {
      from: 'from@email.com',
      to: 'to@email.com',
      subject: 'Hi Mate',
      template: 'welcome', 
      context: {
        name: 'John Doe',
        service: 'Apple inc'
      }
    }
    
email.send(emailOptions)
    
/* Template refers to whatever email template you want to use, create one of your choice in the emails found//
Any key you add to the context is accessible in the template using {{}} 
For example

Hi {{name}},
Welcome to ((service)) 

Should compile to:
Hi John Doe,
Welcome to Apple inc

*/

```


## Packages
-----------

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
--------
- [ ] Account deletion
- [ ] Update account
- [X] Improved error handling
- [X] Enable view-caching in production
- [ ] Implement csrf via csurf or lusca config
- [X] Flash messages
- [X] Emails
- [X] Password Reset

[build]: https://travis-ci.org/kennymark/Express-starter
[build-badge]: https://travis-ci.org/kennymark/Express-starter.svg?branch=master
[license-badge]: https://img.shields.io/npm/l/@testing-library/react.svg?style=flat-square
[license]: https://github.com/IQAndreas/markdown-licenses/blob/master/mit.md
[dependencies]: https://david-dm.org/kennymark/express-starter.svg

