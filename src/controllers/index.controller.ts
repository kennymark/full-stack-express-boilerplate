import { Request, Response } from 'express';

// Shows all the main routes in the application
class IndexController {
  showHome(req: Request, res: Response) {
    res.render('home', { title: 'Home' })
  }
  showContact(req: Request, res: Response) {
    res.render('contact', { title: 'Contact' })
  }

  showAbout(req: Request, res: Response) {
    res.render('about', { title: 'About' })
  }

  showPricing(req: Request, res: Response) {
    res.render('pricing', { title: 'Pricing' })
  }
}

export default new IndexController()