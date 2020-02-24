"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexController = /** @class */ (function () {
    function IndexController() {
    }
    IndexController.prototype.showHome = function (_, res) {
        res.render('home', { title: 'Home' });
    };
    IndexController.prototype.showContact = function (_, res) {
        res.render('contact', { title: 'Contact' });
    };
    IndexController.prototype.showAbout = function (_, res) {
        res.render('about', { title: 'About' });
    };
    IndexController.prototype.showPricing = function (_, res) {
        res.render('pricing', { title: 'Pricing' });
    };
    return IndexController;
}());
exports.default = new IndexController();
