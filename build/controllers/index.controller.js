"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
    showHome(req, res) {
        res.render('home', { title: 'Home' });
    }
    showContact(req, res) {
        res.render('contact', { title: 'Contact' });
    }
    showAbout(req, res) {
        res.render('about', { title: 'About' });
    }
    showPricing(req, res) {
        res.render('pricing', { title: 'Pricing' });
    }
}
exports.default = new IndexController();
