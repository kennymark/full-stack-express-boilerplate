class IndexController {
  showHome(_, res) {
    res.render('home', { title: 'Home' })
  }
  showContact(_, res) {
    res.render('contact', { title: 'Contact' })
  }

  showAbout(_, res) {
    res.render('about', { title: 'About' })
  }

  showPricing(_, res) {
    res.render('pricing', { title: 'Pricing' })
  }
}

export default new IndexController()