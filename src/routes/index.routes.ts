import { Router, Request, Response, NextFunction } from 'express'
import indexController from '../controllers/index.controller'
import userController from '../controllers/user.controller'
import contactController from '../controllers/contact.controller'

const router = Router()

export function preventVisitingNormal(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next()
}

router.get('/', indexController.showHome)

router
  .route('/contact')
  .get(indexController.showContact, preventVisitingNormal)
  .post(contactController)

router.get('/pricing', indexController.showPricing)
router.get('/about', indexController.showAbout, preventVisitingNormal)

// Social Authentication for redirects 
router.get('/oauth/google', userController.googleLogin)
router.get('/oauth/facebook/', userController.facebookLogin)
router.get('/oauth/github/', userController.githubLogin)
router.get('/oauth/twitter/', userController.twitterLogin)


export default router