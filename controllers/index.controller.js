import moment from 'moment/moment'

class IndexController {
	showHome(req, res) {
		res.set('Authorization', 'onsnsns')
		return res.render('home', { title: 'Home' })
	}
	showContact(req, res) {
		return res.render('contact', { title: 'Contact' })
	}

	showAbout(req, res) {
		return res.render('about', { title: 'About' })
	}

	showPricing(req, res) {
		return res.render('pricing', { title: 'Pricing' })
	}
}

export default new IndexController()
