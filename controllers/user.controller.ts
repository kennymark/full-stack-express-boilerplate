import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config';
import messages from '../data/messages';
import userModel from '../models/user.model';
import emailController from './email.controller';
import { Request, Response, NextFunction } from 'express'
import { getUrl } from '../config/util';
import { IVerifyOptions } from 'passport-local';

class UserController {


  showLogin(req: Request, res: Response) {
    res.render('account/login', { title: 'Login', })
  }

  showRegister(req: Request, res: Response) {
    res.render('account/register', { title: 'Register', })
  }

  async showProfile(req: Request, res: Response) {
    //@ts-ignore
    const user = await userModel.findById(req.user!.id)
    return res.render('account/profile', { title: 'Profile', user })

  }

  showforgottenPassword(req: Request, res: Response) {
    res.render('account/forgot-password', { title: ' Forgotten password' })
  }

  showResetPassword(req: Request, res: Response) {
    res.render('account/reset-password', { title: 'Reset Password', params: req.params })
  }

  async showAdminProfile(req: Request, res: Response) {
    const page = req.query.page || 1
    const activeUsers = await userModel.find({ is_active: true })
    const deletedUsers = await userModel.find({ is_deleted: true })
    const result = await userModel.paginate({ is_deleted: false }, { page, limit: 10 })

    res.render('admin', { title: 'Admin Page', data: result, deletedUsers, activeUsers })
  }

  async search(req: Request, res: Response) {
    const { search, query } = req.query
    const page = req.query.page || 1
    const result = await userModel.paginate({ [query]: new RegExp(`${search}`, 'i') }, { page, limit: 10 })
    console.log(result)
    return res.render('admin', { title: 'Admin Page', data: result })
  }

  socialLogin() {
    console.log('socials tho')
  }


  async localLogin(req: Request, res: Response, next: NextFunction) {
    this.socialLogin()
    passport.authenticate("login", (err: Error, user, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("error", info.message);
        return res.redirect("/user/login");
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash("message", info.message);
        res.redirect("/user/profile");
      });
    })(req, res, next);
  }

  logUserOut(req: Request, res: Response) {
    req.logout()
    req.session.destroy(() => {
      res.redirect('/')
    })
  }

  twitterLogin(req: Request, res: Response, next: NextFunction) {
    loginWithSocial('twitter', req, res, next)
  }

  facebookLogin(req: Request, res: Response, next: NextFunction) {
    loginWithSocial('facebook', req, res, next)
  }

  githubLogin(req: Request, res: Response, next: NextFunction) {
    loginWithSocial('github', req, res, next)
  }

  googleLogin(req: Request, res: Response, next: NextFunction) {
    loginWithSocial('google', req, res, next)
  }


  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    const deleteParams = { is_deleted: true, is_active: false };
    const user = await userModel.findOneAndUpdate(id, deleteParams)
    req.flash('message', messages.account_deleted)
    if (user.is_admin) {
      res.redirect('/user/profile/admin')
    }
    else {
      req.logout()
      req.flash('error', messages.account_deleted)
      req.session.destroy(err => res.redirect('/'))
    }
  }



  async freezeUser(req: Request, res: Response) {
    const { id } = req.params
    await userModel.findOneAndUpdate(id, { is_active: false })
    req.flash('message', messages.account_frozen)
    req.logout()
    res.redirect('/')
  }

  async showEdituser(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await userModel.findById(id)
      if (user) {
        res.render('account/edit-user', { data: user })
      }
    } catch (error) {
      req.flash('error', error)
      res.render('home')
    }
  }

  async updateUser(req: Request, res: Response) {
    const { user: id } = req.session?.passport
    try {
      await userModel.findByIdAndUpdate(id, req.body)
      req.flash('message', messages.user_updated)
      res.redirect('/user/profile/')

    } catch (error) {
      req.flash('error', messages.user_update_error)
      res.redirect('/')
    }
  }

  async updateUserByAdmin(req: Request, res: Response) {
    const { id } = req.params
    try {
      await userModel.findByIdAndUpdate(id, req.body)
      req.flash('message', messages.user_updated)
      res.redirect('/user/profile/admin')
    } catch (error) {
      req.flash('error', messages.user_update_error)
      res.redirect('/user/profile/admin')
    }
  }

  async updateUserPassword(req: Request, res: Response) {
    const { user: id } = req.session?.passport
    const { password } = req.body
    const user = await userModel.findByIdAndUpdate(id, { password })
    if (user) {
      req.flash('message', messages.user_updated)
      res.redirect('/user/profile/')
    } else {
      req.flash('error', messages.general_error)
      res.redirect('/user/profile/')
    }
  }

  async postRegister(req: Request, res: Response) {
    const { email, name, } = req.body
    req.checkBody('name', messages.validation_errors.name).isLength({ min: 5 }).notEmpty()
    req.checkBody('email', messages.validation_errors.emailNotEmpty).isEmail()
    req.checkBody('password', messages.validation_errors.password).isLength({ min: 5 }).notEmpty()
    const link = `${getUrl(req)}/user/login`

    const emailInfo = {
      to: email,
      template: 'welcome',
      subject: 'Thanks for signing up with',
      locals: { name: name, company_name: process.env.APP_NAME, link }
    }

    if (req.validationErrors()) {
      //@ts-ignore
      req.flash('validationErrors', req.validationErrors())
      return res.redirect('/user/register')
    }
    passport.authenticate('signup', async (err, user, info) => {
      try {
        req.flash('message', info.message)
        emailController.send(emailInfo)
        return res.redirect('/')
      } catch (err) {
        req.flash('message', info.message)
        res.redirect('/user/register?' + info.message)
      }
    })(req, res)
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
      const token = await jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: '1h' })
      const { id, name, email } = user
      await userModel.findByIdAndUpdate(id, { resetToken: token })
      const emailInfo = {
        to: email,
        subject: 'Reset Password',
        template: 'password-reset',
        locals: {
          name: name,
          link: `${getUrl(req)}/user/reset-password/${id}/${token}`
        }
      }
      emailController.send(emailInfo)
        .then((x: { text: any; }) => {
          console.log(x.text)
          req.flash('message', messages.passwordResetSuccess(user))
          return res.redirect('/user/login')
        }).catch((err: string) => console.log(err))
    }
    else {
      req.flash('error', messages.user_not_found)
      res.redirect('/user/forgot-password')
    }

  }

  async resetPassword(req: Request, res: Response) {
    const { password, new_password, id, token } = req.body
    req.checkBody('password', messages.validation_errors.password).isLength({ min: 5 }).notEmpty()
    req.checkBody('password', messages.validation_errors.passwordMatch).equals(new_password)
    const validationErrors = req.validationErrors()

    if (validationErrors) {
      //@ts-ignore
      req.flash('validationErrors', validationErrors)
      res.redirect('/user/login')
    }
    else {
      console.log({ id, token })
      const user = await userModel.findById(id)

      if (user.resetToken) {
        const isTokenValid = await jwt.verify(token, config.jwtSecret)
        if (isTokenValid) {
          //@ts-ignore
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

}


function loginWithSocial(social, req, res, next) {
  return passport.authenticate(social, (err, user, _info) => {
    try {
      req.login(user, err => res.redirect('/user/profile/'))
    } catch (error) {
      req.flash('error', messages.login_failure)
      res.redirect('/user/login')
      return next(error)
    }
  })(req, res, next)
}




export default new UserController()