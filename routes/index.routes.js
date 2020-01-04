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
router.get('/oauth/google', new userController().googleLogin)
router.get('/oauth/facebook/', new userController().facebookLogin)
router.get('/oauth/github/', new userController().githubLogin)
router.get('/oauth/twitter/', new userController().twitterLogin)


export default router