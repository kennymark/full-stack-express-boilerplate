"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = __importDefault(require("../controllers/index.controller"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
const router = express_1.Router();
function preventVisitingNormal(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}
exports.preventVisitingNormal = preventVisitingNormal;
router.get('/', index_controller_1.default.showHome);
router
    .route('/contact')
    .get(index_controller_1.default.showContact, preventVisitingNormal)
    .post(contact_controller_1.default);
router.get('/pricing', index_controller_1.default.showPricing);
router.get('/about', index_controller_1.default.showAbout, preventVisitingNormal);
// Social Authentication for redirects 
router.get('/oauth/google', user_controller_1.default.googleLogin);
router.get('/oauth/facebook/', user_controller_1.default.facebookLogin);
router.get('/oauth/github/', user_controller_1.default.githubLogin);
router.get('/oauth/twitter/', user_controller_1.default.twitterLogin);
exports.default = router;
