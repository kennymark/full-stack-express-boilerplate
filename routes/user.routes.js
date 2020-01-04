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
  res.redirect('/')
}


router.route('/login')
  .get(new UserController().showLogin)
  .post(new UserController().localLogin)



router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/login/facebook', passport.authenticate('facebook'))
router.get('/login/github', passport.authenticate('github'))
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


router.get('/logout', new UserController().logUserOut)


router
  .route('/register')
  .get(new UserController().showRegister)
  .post(new UserController().postRegister)



router
  .route('/edit/:id')
  .get(ensureAuthenticated, new UserController().showEdituser)
  .put(ensureAuthenticated, new UserController().updateUser)
  .post(ensureAuthenticated, new UserController().updateUser)


router.put('/update_password/:id', new UserController().updateUserPassword)
router.delete('/delete/:id', ensureAuthenticated, new UserController().deleteUser)

router.put('/freeze/:id', ensureAuthenticated, new UserController().freezeUser)

router
  .route('/forgot-password/')
  .post(new UserController().forgotPassword)
  .get(new UserController().showforgottenPassword)

router.get('/reset-password/:token/:id', new UserController().showResetPassword)
router.post('/reset-password/', new UserController().resetPassword)


//Authenticated routes
router.get('/profile/admin/', ensureAuthenticated, isAdmin, new UserController().showAdminProfile)
router.get('/profile/admin/search/', ensureAuthenticated, isAdmin, new UserController().search)
router.get('/profile/:id', ensureAuthenticated, new UserController().showProfile)

export default router