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

router.get('/login', UserController.showLogin)
router.post('/login', UserController.localLogin)
router.post('/logout', ensureAuthenticated, UserController.logUserOut)

router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/login/facebook', passport.authenticate('facebook'))
router.get('/login/github', passport.authenticate('github'))
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


router.get('/register', UserController.showRegister)
router.post('/register', UserController.postRegister)

router.get('/logout', UserController.logUserOut)
router.delete('/delete/:id', ensureAuthenticated, UserController.deleteUser)

router.get('/edit/:id', ensureAuthenticated, UserController.showEdituser)
router.put('/edit/:id', ensureAuthenticated, UserController.updateUser)

router.post('/forgot-password/', UserController.forgotPassword)
router.get('/forgot-password', UserController.showforgottenPassword)
router.get('/reset-password', UserController.showResetPassword)
router.post('/reset-password/:token/:id', UserController.resetPassword)


//Authenticated routes
router.get('/profile/admin/', ensureAuthenticated, UserController.showAdminProfile)
router.get('/profile/admin/search/', ensureAuthenticated, UserController.searchUser)
router.get('/profile/:id', ensureAuthenticated, UserController.showProfile)

export default router