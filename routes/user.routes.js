import express from 'express'
import UserController from '../controllers/user.controller'
import passport from 'passport'
import userController from '../controllers/user.controller';
let router = express.Router()

export function ensureAuthenticated(req, res, next) {
	if (req.user) return next()
	res.redirect('/user/login?user_login_err')
}

router.get('/login', UserController.showLogin)
router.post('/login', UserController.postUserlogin)

router.get('/profile/:id', ensureAuthenticated, UserController.showProfile)

router.post('/logout', UserController.logUserOut)

router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/oauth/twitter_callback', UserController.twitterLogin)

router.get('/login/google', passport.authenticate('google', {
	scope:
		['https://www.googleapis.com/auth/plus.login',
			, 'https://www.googleapis.com/auth/plus.profile.emails.read']
}))

router.get('/oauth/google_callback', userController.googleLogin)

router.get('/register', UserController.showRegister)
router.post('/register', UserController.postRegister)

router.get('/logout', UserController.logUserOut)
router.delete('/delete/:id', UserController.deleteUser)

router.get('/edit/:id', ensureAuthenticated, UserController.showEdituser)
router.put('/edit/:id', ensureAuthenticated, UserController.updateUser)

router.get('/confirm_email/:id', UserController.confirmEmail)

// router.get('/user/:id'), UserController.;

export default router
