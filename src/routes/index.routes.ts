import { Router } from 'express'
import indexController from '../controllers/index.controller'
import userController from '../controllers/user.controller'
import contactController from '../controllers/contact.controller'
import { ensureNotAuthenticated } from './user.routes'

const router = Router()



router.get('/', indexController.showHome)

router
  .route('/contact')
  .get(indexController.showContact)
  .post(contactController)

router.get('/pricing', indexController.showPricing, ensureNotAuthenticated)
router.get('/about', indexController.showAbout, ensureNotAuthenticated)

// Social Authentication for redirects 
router.get('/oauth/google', userController.googleLogin)
router.get('/oauth/facebook/', userController.facebookLogin)
router.get('/oauth/github/', userController.githubLogin)
router.get('/oauth/twitter/', userController.twitterLogin)


export default router