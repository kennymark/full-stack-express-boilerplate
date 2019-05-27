import express from 'express'
import indexController from '../controllers/index.controller'

const router = express.Router()

router.get('/', indexController.showHome)
router.get('/contact', indexController.showContact)
router.get('/pricing', indexController.showPricing)
router.get('/about', indexController.showAbout)

export default router
