import express from 'express'
import indexController from '../controllers/index.controller'
import userController from '../controllers/user.controller'
import contactController from '../controllers/contact.controller'
const router = express.Router()


router.get('/', indexController.showHome)

router
  .route('/contact')
  .get(indexController.showContact)
  .post(contactController.receiveAndSend)

router.get('/pricing', indexController.showPricing)
router.get('/about', indexController.showAbout)

// Social Authentication for redirects 
router.get('/oauth/google', userController.googleLogin)
router.get('/oauth/facebook/', userController.facebookLogin)
router.get('/oauth/github/', userController.githubLogin)
router.get('/oauth/twitter/', userController.twitterLogin)


export default router