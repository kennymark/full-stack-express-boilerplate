import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config';
import messages from '../data/messages';
import userModel from '../models/user.model';
import emailController from './email.controller';
class UserController {

  showLogin(_, res) {
    res.render('login', { title: 'Login' })
  }

  showRegister(_, res) {
    res.render('register', { title: 'Register' })
  }

  async showProfile(req, res) {
    const { id } = req.params
    const user = await userModel.findById(id)
    return res.render('profile', { title: 'Profile', user })
  }

  showforgottenPassword(_, res) {
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
    const page = req.query.page || 1

    try {
      const result = await userModel.paginate({
        [query]: { $regex: `${search}` }
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
          if (user.is_admin) res.redirect('/user/profile/admin/')
          if (user.is_deleted) {
            req.flash('error', messages.user_not_found)
            res.redirect('/')
          }
          else return res.redirect(302, '/user/profile/' + user.id)
        })
      } catch (error) { return next(error) }
    })(req, res, next)
  }

  logUserOut(req, res) {
    req.logout()
    res.redirect('/')
  }

  twitterLogin(req, res, next) {
    passport.authenticate('twitter', async (err, user, _info) => {
      try {
        if (err || !user) return res.render('login', { error: messages.user_not_found })
        req.login(user, err => {
          return res.redirect('/user/profile/' + user.id)
        })
      } catch (error) { return next(error) }
    })(req, res, next)
  }

  facebookLogin(req, res, next) {
    passport.authenticate('facebook', (_err, user, _info) => {
      try {
        if (user) {
          req.login(user, _err => {
            res.redirect('/user/profile/' + user.id)
          })
        }
      } catch (error) {
        res.redirect('/user/login')
        return next(error)
      }
    })(req, res, next)
  }

  githubLogin(req, res, next) {
    passport.authenticate('github', (_err, user, _info) => {
      try {
        if (user) {
          req.login(user, _ => {
            res.redirect('/user/profile/' + user.id)
          })
        }
      } catch (error) {
        res.redirect('/user/login')
        return next(error)
      }
    })(req, res, next)
  }

  googleLogin(req, res, next) {
    passport.authenticate('google', (_err, user, _info) => {
      try {
        req.login(user, error => {
          if (error) return next(error)
          if (user.isAdmin) res.redirect('/user/profile/admin/')
          else { return res.redirect(302, '/user/profile/' + user.id) }
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  }

  async deleteUser(req, res) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { deleted: true })
    req.flash('message', messages.account_deleted)
    res.redirect('/')
  }

  async freezeUser(req, res) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { is_active: false })
    req.flash('message', messages.account_frozen)
    req.logout()
    res.redirect('/')
  }

  async showEdituser(req, res) {
    const { id } = req.params
    try {
      const user = await userModel.findById(id)
      if (user) {
        res.render('edit-user', { data: user })
      }
    } catch (error) {
      req.flash('error', error)
      res.render('home')
    }
  }

  async updateUser(req, res) {
    const id = req.params.id || req.body.id
    try {
      const user = await userModel.findByIdAndUpdate(id, req.body)
      if (user) {
        req.flash('message', messages.user_updated)
        res.render('home')
      }
    } catch (error) {
      req.flash('error', messages.user_not_found)
      res.render('home')
    }
  }

  async updateUserPassword(req, res, next) {
    const { password, id } = req.body
    const user = await userModel.findByIdAndUpdate(id, { password })

    if (user) {
      res.redirect(req.baseUrl)
    }
    else {
      req.flash('error', messages.general_error)
      next()
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
    const website = 'http://localhost:3000'
    if (user) {
      req.flash('message', messages.passwordResetSuccess(user))
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
          link: `${website}/user/reset-password/${token}/${id}`
        }
      }
      emailController.send(emailData)
      res.redirect('/user/reset-password')

    } else {
      req.flash('error', messages.passwordResetFail(email))
      res.redirect('/user/forgot-password')
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

    try {
      const { resetToken } = await userModel.findById(id)
      const userHasToken = await userModel.findOne({ resetToken })
      if (userHasToken) {
        const isTokenValid = await jwt.verify(token, config.jwtSecret)
        if (isTokenValid) {
          await userModel.findOneAndUpdate({ password })
          req.flash('message', messages.password_reset_success)
          res.redirect('/user/login')
        }
      } else {
        req.flash('error', messages.pas)
        res.redirect('/user/login')
      }

    } catch (error) {
      req.flash('error', error)
      res.redirect('/user/reset-password')
    }
  }

}
export default new UserController()