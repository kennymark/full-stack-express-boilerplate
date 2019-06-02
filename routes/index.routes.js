import express from 'express'
import indexController from '../controllers/index.controller'
import userController from '../controllers/user.controller'

const router = express.Router()


router.get('/', indexController.showHome)
router.get('/contact', indexController.showContact)
router.get('/pricing', indexController.showPricing)
router.get('/about', indexController.showAbout)
router.get('/forgotten-password', userController.showforgottenPassword)

// Authentication 
// router.get('/login/twitter', passport.authenticate('twitter'))
router.get('/_oauth/twitter/', userController.twitterLogin)

// router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/oauth/google', userController.googleLogin)

router.get('/forgotten-password', userController.showforgottenPassword)

export default router