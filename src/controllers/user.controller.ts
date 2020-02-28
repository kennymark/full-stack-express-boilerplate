import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config';
import messages from '../data/messages';
import userModel from '../models/user.model';
import emailController from './email.controller';
import { Request, Response, NextFunction } from 'express'
import { getUrl } from '../config/util';
import { IVerifyOptions } from 'passport-local';
import { Routes } from '../data/routes';
import { UserDoc } from 'main';

class UserController {

  showLogin(req: Request, res: Response) {
    res.render('account/login', { title: 'Login', })
  }

  showRegister(req: Request, res: Response) {
    res.render('account/register', { title: 'Register', })
  }

  async showProfile(req: Request, res: Response) {
    //@ts-ignore
    const user: UserDoc = await userModel.findById(req.user!.id)
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
    //@ts-ignore
    const result = await userModel.paginate({ is_deleted: false }, { page, limit: 10 })

    res.render('admin', { title: 'Admin Page', data: result, deletedUsers, activeUsers })
  }

  async search(req: Request, res: Response) {
    const { search, query } = req.query
    const page = req.query.page || 1
    //@ts-ignore
    const result = await userModel.paginate({ [query]: new RegExp(`${search}`, 'i') }, { page, limit: 10 })
    return res.render('admin', { title: 'Admin Page', data: result })
  }

  async localLogin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("login", (err: Error, user, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("error", info.message);
        return res.redirect(accountify(Routes.login));
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash("message", info.message);
        res.redirect(accountify(Routes.profile));
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
      res.redirect(accountify(Routes.profile_admin))
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
      res.render('account/edit-user', { data: user })
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
      res.redirect(accountify(Routes.profile))
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
      res.redirect(accountify(Routes.profile_admin))
    } catch (error) {
      req.flash('error', messages.user_update_error)
      res.redirect(accountify(Routes.profile_admin))
    }
  }

  async updateUserPassword(req: Request, res: Response) {
    const { user: id } = req.session?.passport
    const { password } = req.body
    const user = await userModel.findByIdAndUpdate(id, { password })
    if (user) {
      req.flash('message', messages.user_updated)
      res.redirect(accountify(Routes.profile))
    } else {
      req.flash('error', messages.general_error)
      res.redirect(accountify(Routes.profile))
    }
  }

  async postRegister(req: Request, res: Response) {
    const { email, name, } = req.body
    req.checkBody('name', messages.validation_errors.name).isLength({ min: 5 })
    req.checkBody('email', messages.validation_errors.emailNotEmpty).isEmail()
    req.checkBody('password', messages.validation_errors.password).isLength({ min: 5 })
    const link = `${getUrl(req)}/account/login`

    const emailInfo = {
      to: email,
      template: 'welcome',
      subject: 'Thanks for signing up with',
      locals: { name, company_name: process.env.APP_NAME, link }
    }

    if (req.validationErrors()) {
      req.flash('validationErrors', req.validationErrors() as any)
      return res.redirect(accountify(Routes.register))
    }
    passport.authenticate('signup', async (err, user, info) => {
      try {
        req.flash('message', info.message)
        await emailController.send(emailInfo)
        return res.redirect('/')
      } catch (err) {
        req.flash('message', info.message)
        res.redirect(accountify(Routes.register + info.message))
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
          link: `${getUrl(req)}/account/reset-password/${id}/${token}`
        }
      }
      sendEmail(req, res, user, emailInfo)
    }
    else {
      req.flash('error', messages.user_not_found)
      res.redirect(accountify(Routes.forgot_password))
    }

  }

  async resetPassword(req: Request, res: Response) {
    const { id, token, password, new_password } = req.body
    req.checkBody("password", "Password must be at least 5 characters long").isLength({ min: 4 })
    req.checkBody("new_password", "Passwords do not match").equals(new_password)
    const errors = req.validationErrors() as any;

    if (errors) {
      req.flash('validationErrors', errors)
      res.redirect(accountify(Routes.password_reset))
    }
    const user = await userModel.findById(id)
    const tokenValid = await jwt.verify(token, config.jwtSecret)
    console.log({ tokenValid, password, new_password, token, id })
    if (tokenValid && user) {
      user.password = password
      user.resetToken = null
      const savedUser = await user.save()
      const emailInfo = {
        to: savedUser.email,
        subject: 'Password reset succesful',
        template: 'password-reset/success',
        locals: {
          name: savedUser.name,
          link: `${getUrl(req)}/${accountify(Routes.login)}`
        }
      }
      await emailController.send(emailInfo)
      req.flash('message', messages.password_reset_success)
      res.redirect(accountify(Routes.login))
    } else {
      req.flash('error', messages.reset_token_expired)
      res.redirect(accountify(Routes.password_reset))
    }
  }

}

export function accountify(route) {
  return `/account/${route}`
}

function sendEmail(req, res, user, emailInfo) {
  emailController.send(emailInfo)
    .then((x: { text: any; }) => {
      req.flash('message', messages.passwordResetSuccess(user))
      return res.redirect(accountify(Routes.login))
    })
    .catch((err: string) => console.log(err))
}


function loginWithSocial(social: string, req: Request, res: Response, next: NextFunction) {
  return passport.authenticate(social, (err, user, _info) => {
    try {
      req.login(user, err => res.redirect(accountify(Routes.login)))
    } catch (error) {
      req.flash('error', messages.login_failure)
      res.redirect('/user/login')
      return next(error)
    }
  })(req, res, next)
}




export default new UserController()