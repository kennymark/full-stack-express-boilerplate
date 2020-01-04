import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config';
import messages from '../data/messages';
import userModel from '../models/user.model';
import emailController from './email.controller';
class UserController {
  constructor() {
    this.socialLogin = this.socialLogin.bind(this)
  }
  showLogin = (_, res) => {
    res.render('login', { title: 'Login' })
  }

  showRegister = (_, res) => {
    res.render('register', { title: 'Register' })
  }

  async showProfile(req, res) {
    const { id } = req.params
    const user = await userModel.findById(id)
    return res.render('profile', { title: 'Profile', user })
  }

  showforgottenPassword = (_, res) => {
    res.render('forgot-password', { title: ' Forgotten password' })
  }

  showResetPassword(_, res) {
    res.render('reset-password', { title: 'Reset Password' })
  }

  async showAdminProfile(req, res) {
    const page = req.query.page || 1
    const activeUsers = await userModel.find({ is_active: true })
    const deletedUsers = await userModel.find({ is_deleted: true })
    const result = await userModel.paginate({ is_deleted: false }, { page, limit: 10 })
    let pagesArr = []
    res.render('admin', {
      title: 'Admin Page',
      pages: pagesArr,
      data: result,
      deletedUsers,
      activeUsers
    })
  }



  async search(req, res) {
    const { search, query } = req.query
    console.log({ search, query })
    const page = req.query.page || 1
    try {
      const result = await userModel.find({
        [query]: { $regex: query, option: 'i' }
      }, { page, limit: 10 })
      console.log(': result', result)
      return res.render('admin', { title: 'Admin Page', data: result })
    } catch (err) {
      return res.render('admin', { title: 'Admin Error', msg: err, type: 'danger' })
    }
  }


  async localLogin(req, res, next) {
    passport.authenticate('login', async (err, user, _info) => {
      try {
        if (err || !user) return res.render('login', { error: messages.user_not_found })
        req.login(user, _ => {
          if (user.is_admin) return res.redirect('/user/profile/admin/')
          if (user.is_deleted) {
            req.flash('error', messages.user_not_found)
            return res.redirect('/user/register')
          }
          return res.redirect('/user/profile/' + user.id)
        })
      } catch (error) { return next(error) }
    })(req, res, next)
  }

  logUserOut(req, res, next, url = '/') {
    req.logout()
    res.redirect(url)
  }

  async twitterLogin(req, res, next) {
    this.socialLogin('twitter', req, res, next)
  }

  facebookLogin(req, res, next) {
    this.socialLogin('facebook', req, res, next)
  }

  githubLogin(req, res, next) {
    this.socialLogin('github', req, res, next)
  }

  googleLogin(req, res, next) {
    this.socialLogin('google', req, res, next)
  }

  socialLogin(service, req, res, next) {
    passport.authenticate(service, (_err, user, _info) => {
      try {
        if (user) {
          req.login(user, err => res.redirect('/user/profile/' + user.id))
        }
      } catch (error) {
        req.flash('error', messages.login_failure)
        res.redirect('/user/login')
        return next(error)
      }
    })(req, res, next)
  }

  async deleteUser(req, res) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { is_deleted: true })
    req.flash('message', messages.account_deleted)
    this.logUserOut()
  }

  async deleteUserByAdmin(req, res) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { is_deleted: true })
    req.flash('message', messages.account_deleted)
    this.logUserOut('/admin')
  }

  async freezeUser(req, res) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { is_active: false })
    req.flash('message', messages.account_frozen)
    this.logUserOut()
  }

  async showEdituser(req, res) {
    const { id } = req.params
    const user = await userModel.findById(id)
    try {
      res.render('edit-user', { data: user })
    } catch (error) {
      req.flash('error', error)
      res.redirect('/')
    }
  }

  async updateUser(req, res) {
    const { id } = req.params
    console.log(req.body)
    try {
      await userModel.findByIdAndUpdate(id, req.body)
      req.flash('message', messages.user_updated)
      res.redirect('/user/profile/' + id)
    } catch (error) {
      req.flash('error', messages.user_update_error)
      res.redirect('/')
    }
  }

  async updateUserPassword(req, res) {
    const { id } = req.params
    const { password } = req.body
    const user = await userModel.findByIdAndUpdate(id, { password })
    if (user) {
      req.flash('message', messages.user_updated)
      res.redirect(req.originalUrl)
    }
    else {
      req.flash('error', messages.general_error)
      res.redirect(req.originalUrl)
    }
  }

  async postRegister(req, res) {
    req.checkBody('name', 'Name should be greater than 5 characters').isLength(5)
    req.checkBody('name', 'Name cannot be empty').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('password', 'Password should be greater than 5 characters').isLength(5)
    req.checkBody('password', 'Password is show not be empty').notEmpty()

    if (req.validationErrors()) {
      req.flash('validationErrors', req.validationErrors())
      return res.redirect('/user/register')
    }

    passport.authenticate('signup', async (err, user, info) => {
      try {
        if (err || !user) {
          req.flash('error', info.message)
          return res.redirect('/user/register')
        } else {
          req.flash('message', info.message)
          return res.redirect('/')
        }
      } catch (error) {
        req.flash('message', error)
        res.redirect('/user/register?' + user_register_err)
      }
    })(req, res)
  }

  async forgotPassword(req, res) {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (user) {
      const token = await jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: '1h' })
      const { id, name, email } = user

      await userModel.findByIdAndUpdate(id, { resetToken: token })

      const emailData = {
        from: 'mycompany@hotmail.com',
        to: email,
        subject: 'Reset Password',
        template: 'password-reset',
        context: {
          name: name,
          link: `${fullUrl}/user/reset-password/${token}/${id}`
        }
      }
      emailController.send(emailData)
        .then(x => {
          req.flash('message', messages.passwordResetSuccess(user))
          res.redirect('/user/login')
        })
        .catch(x => {
          req.flash('error', x)
          res.redirect('/user/forgot-password')
        })
    }
  }

  async resetPassword(req, res) {
    const { password, new_password } = req.body
    const { token, id } = req.params
    req.checkBody('password', 'Password is show not be empty').notEmpty()
    req.checkBody('new_password', 'Password is show not be empty').notEmpty()
    req.checkBody('password', 'Password should be greater than 5 characters').isLength(5)
    req.checkBody('password', 'Make ensure the passwords are equal').equals(new_password)
    const validationErrors = req.validationErrors()

    if (validationErrors) {
      req.flash('validationErrors', validationErrors)
    }

    const user = await userModel.findById(id)

    if (user.resetToken) {
      const isTokenValid = await jwt.verify(token, config.jwtSecret)
      if (isTokenValid) {
        await userModel.findOneAndUpdate({ password })
        req.flash('message', messages.password_reset_success)
        res.redirect('/user/login')
      }
      else {
        req.flash('error', messages.password_reset_fail)
        res.redirect('/user/login')
      }
    }
  }

}


export default UserController