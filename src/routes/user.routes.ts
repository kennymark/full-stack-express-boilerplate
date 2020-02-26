
import UserController, { accountify } from '../controllers/user.controller'
import passport from 'passport'
import messages from '../data/messages';
import { Request, Response, NextFunction, Router } from 'express'
import { Account } from '../data/routes';
const router = Router()

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next()
  req.flash('error', messages.cant_access_resource)
  res.redirect(accountify(Account.login))
}

export function ensureNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return next()
  req.flash('error', messages.logout_to_view)
  res.redirect(accountify(Account.profile))
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  if (req.user?.is_admin) return next()
  req.flash('error', messages.cant_access_resource)
  res.redirect('/')
}


router.route('/login')
  .get(ensureNotAuthenticated, UserController.showLogin)
  .post(UserController.localLogin)



router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/login/facebook', passport.authenticate('facebook'))
router.get('/login/github', passport.authenticate('github'))
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))


router.get('/logout', UserController.logUserOut, ensureAuthenticated)


router
  .route('/register')
  .get(ensureNotAuthenticated, UserController.showRegister)
  .post(UserController.postRegister)


router
  .route('/edit/:id?')
  .get(ensureAuthenticated, UserController.showEdituser)
  .put(ensureAuthenticated, UserController.updateUser)

router
  .route('/admin-edit/:id?')
  .get(ensureAuthenticated, UserController.showEdituser)
  .put(ensureAuthenticated, UserController.updateUserByAdmin)

router.put('/update_password', UserController.updateUserPassword)

router
  .route('/delete/:id?')
  .delete(ensureAuthenticated, UserController.deleteUser)



router.put('/freeze/:id', ensureAuthenticated, UserController.freezeUser)

router
  .route('/forgot-password/')
  .post(UserController.forgotPassword)
  .get(UserController.showforgottenPassword)

router.get('/reset-password/:id?/:token?', UserController.showResetPassword)
router.post('/reset-password/', UserController.resetPassword)


//Authenticated routes
router.get('/profile/admin/', ensureAuthenticated, isAdmin, UserController.showAdminProfile)
router.get('/profile/admin/search/', ensureAuthenticated, isAdmin, UserController.search)
router.get('/profile/', ensureAuthenticated, UserController.showProfile)

export default router