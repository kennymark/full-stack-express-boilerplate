import express from 'express'
import indexController from '../controllers/index.controller'
import userController from '../controllers/user.controller'

const router = express.Router()


router.get('/', indexController.showHome)
router.get('/contact', indexController.showContact)
router.get('/pricing', indexController.showPricing)
router.get('/about', indexController.showAbout)
router.get('/forgotten-password', userController.showforgottenPassword)

// Social Authentication for redirects 
router.get('/oauth/google', userController.googleLogin)
router.get('/_oauth/twitter/', userController.twitterLogin)
router.get('/oauth/facebook/', userController.facebookLogin)
router.get('/oauth/github/', userController.githubLogin)


export default router