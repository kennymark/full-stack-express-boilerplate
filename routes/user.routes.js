import express from 'express'
import UserController from '../controllers/user.controller'
import passport from 'passport'
import messages from '../data/messages';

const router = express.Router()

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next()
  req.flash('error', messages.cant_access_resource)
  res.redirect('/user/login?user_login_err')
}

export function isAdmin(req, res, next) {
  if (req.user.is_admin) return next()
  req.flash('error', messages.cant_access_resource)
  res.redirect(req.baseUrl)
}

router.get('/login', UserController.showLogin)
router.post('/login', UserController.localLogin)
router.post('/logout', ensureAuthenticated, UserController.logUserOut)

router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/login/facebook', passport.authenticate('facebook'))
router.get('/login/github', passport.authenticate('github'))
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


router.router('/register')
  .get(UserController.showRegister)
  .post(UserController.postRegister)

router.get('/logout', UserController.logUserOut)
router.delete('/delete/:id', ensureAuthenticated, UserController.deleteUser)

router.get('/edit/:id', ensureAuthenticated, isAdmin, UserController.showEdituser)
router.put('/edit/:id', ensureAuthenticated, isAdmin, UserController.updateUser)

router.get('/freeze/:id', ensureAuthenticated, UserController.freezeUser)

router.post('/forgot-password/', UserController.forgotPassword)
router.get('/forgot-password', UserController.showforgottenPassword)

router.get('/reset-password/:token/:id', UserController.showResetPassword)
router.post('/reset-password/', UserController.resetPassword)


//Authenticated routes
router.get('/profile/admin/', ensureAuthenticated, UserController.showAdminProfile)
router.get('/profile/admin/search/', ensureAuthenticated, UserController.search)
router.get('/profile/:id', ensureAuthenticated, UserController.showProfile)

export default router