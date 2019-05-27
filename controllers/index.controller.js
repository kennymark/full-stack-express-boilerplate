import moment from 'moment/moment'
const time = moment()

class IndexController {
	showHome(req, res) {
		res.set('Authorization', 'onsnsns')
		return res.render('home', { title: 'Home', date: time.year() })
	}
	showContact(req, res) {
		return res.render('contact', { title: 'Contact', date: time.year() })
	}

	showAbout(req, res) {
		return res.render('about', { title: 'About', date: time.year() })
	}

	showPricing(req, res) {
		return res.render('pricing', { title: 'Pricing', date: time.year() })
	}
}

export default new IndexController()
