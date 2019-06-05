import user from '../models/user.model'
import moment from 'moment/moment'
import messages from '../data/messages'
import emailController from './email.controller'
import passport from 'passport'

class UserController {

  showLogin(req, res) {
    res.render('login', { title: 'Login' })
  }

  showRegister(req, res) {
    res.render('register', { title: 'Register' })
  }

  async showProfile(req, res) {
    const _id = req.params.id
    const person = await user.findById({ _id })
    return res.render('profile', { title: 'Profile', user: person })
  }

  showforgottenPassword(req, res) {
    res.render('forgotten-password', { title: ' Forgotten password' })
  }

  async showAdminProfile(req, res) {
    const page = req.query.page || 1
    const result = await user.paginate({}, { page, limit: 10 })
    let pagesArr = []
      // console.log(result)
      // for (let i = 0; i < totalPages; i++) {
      //   pagesArr.push(i + 1)
      // }
    return res.render('admin', {
      title: 'Admin Page',
      pages: pagesArr,
      data: result
    })
  }

  async confirmEmail(req, res) {
    const { id } = req.params
    const data = user.findByIdAndUpdate(id, { isConfirmed: true })
    if (person) {
      res.render('profile', { title: 'Profile', data })
    }
  }

  async resetPassword(req, res) {
    const { email, password } = req.body
    const personExist = await user.findOne({ email })
    try {
      if (personExist) {
        await user.findOneAndUpdate({ password })
        emailController.send()
      }
    } catch (error) {
      res.render('forgotten-password', { error })
    }
  }

  async searchUserById(req, res) {
    const { search } = req.query
    const page = req.query.page || 1
    try {
      user.paginate({}, { page, limit: 10 }, (err, result) => {
        return res.render('admin', {
          title: 'Admin Page',
          data: result
        })
      });
    } catch (err) {
      return res.render('admin', { title: 'Admin Error', msg: err, type: 'danger' })
    }
  }

  async searchUser(req, res) {
    const { search } = req.query
    const page = req.query.page || 1

    try {
      const result = await user.paginate({ name: /`${search}`/ }, { page, limit: 10 })
      return res.render('admin', { title: 'Admin Page', data: result })
    } catch (err) {
      return res.render('admin', { title: 'Admin Error', msg: err, type: 'danger' })
    }
  }


  async postUserlogin(req, res, next) {
    const { render } = res
    passport.authenticate('login', async(err, user, info) => {
      try {
        if (err || !user) return render('login', { error: messages.user_not_found })
        req.login(user, async error => {
          if (error) return next(error)
          if (user.isAdmin) res.redirect('/user/profile/admin/')
          else { return res.redirect(302, '/user/profile/' + user.id) }
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  }

  twitterLogin(req, res, next) {
    passport.authenticate('twitter', (err, user, info) => {
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

  facebookLogin(req, res, next) {
    passport.authenticate('facebook', (err, user, info) => {
      try {
        if (user) {
          req.login(user, err => {
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
    passport.authenticate('github', (err, user, info) => {
      try {
        if (user) {
          req.login(user, err => {
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
    passport.authenticate('google', (err, user, info) => {
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
    const _id = req.params.id || req.body.id
    await user.findOneAndUpdate({ _id }, { deleted: true })
    req.flash('message', messages.account_deleted)
    res.redirect('/')
  }

  async freezeUser(req, res) {
    const _id = req.params.id || req.body.id
    await user.findOneAndUpdate({ _id }, { isActive: false })
    req.flash('message', messages.user_updated)
    res.redirect('/')
  }

  async showEdituser(req, res) {
    const { id: _id } = req.params
    try {
      const person = await user.findById({ _id })
      if (person) {
        res.render('edit-user', { data: person })
      }
    } catch (error) {
      req.flash('error', messages.user_not_found)
      res.render('index')
    }
  }

  async updateUser(req, res) {
    const id = req.params.id || req.body.id
    try {
      const person = await user.findByIdAndUpdate(id)
      if (person) {
        req.flash('message', messages.user_updated)
        res.render('index')
      }
    } catch (error) {
      req.flash('error', messages.user_not_found)
      res.render('index')
    }
  }

  logUserOut(req, res) {
    req.logout()
    res.redirect('/')
  }

  async postRegister(req, res) {
    const { render } = res
    req.checkBody('name', 'Name should be greater than 5 characters').isLength(5)
    req.checkBody('name', 'Name cannot be empty').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('password', 'Password should be greater than 5 characters').isLength(5)
    req.checkBody('password', 'Password is show not be empty').notEmpty()

    if (req.validationErrors()) {
      req.flash('validationErrors', req.validationErrors())
      return res.render('register')
    }
    passport.authenticate('signup', async(err, user, info) => {
      try {
        if (err || !user) {
          req.flash('error', info.message)
          return res.render('Register', { title: 'Register' })
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
}

export default new UserController()