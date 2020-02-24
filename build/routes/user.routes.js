"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = __importDefault(require("../controllers/user.controller"));
var passport_1 = __importDefault(require("passport"));
var messages_1 = __importDefault(require("../data/messages"));
var router = express_1.Router();
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.flash('error', messages_1.default.cant_access_resource);
    res.redirect('/user/login?user_login_err');
}
exports.ensureAuthenticated = ensureAuthenticated;
function isAdmin(req, res, next) {
    var _a;
    //@ts-ignore
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.is_admin)
        return next();
    req.flash('error', messages_1.default.cant_access_resource);
    res.redirect('/');
}
exports.isAdmin = isAdmin;
router.route('/login')
    .get(user_controller_1.default.showLogin)
    .post(user_controller_1.default.localLogin);
router.get('/login/twitter', passport_1.default.authenticate('twitter'));
router.get('/login/facebook', passport_1.default.authenticate('facebook'));
router.get('/login/github', passport_1.default.authenticate('github'));
router.get('/login/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/logout', user_controller_1.default.logUserOut);
router
    .route('/register')
    .get(user_controller_1.default.showRegister)
    .post(user_controller_1.default.postRegister);
router
    .route('/edit/:id?')
    .get(ensureAuthenticated, user_controller_1.default.showEdituser)
    .put(ensureAuthenticated, user_controller_1.default.updateUser);
router
    .route('/admin-edit/:id?')
    .get(ensureAuthenticated, user_controller_1.default.showEdituser)
    .put(ensureAuthenticated, user_controller_1.default.updateUserByAdmin);
router.put('/update_password', user_controller_1.default.updateUserPassword);
router
    .route('/delete/:id?')
    .delete(ensureAuthenticated, user_controller_1.default.deleteUser);
router.put('/freeze/:id', ensureAuthenticated, user_controller_1.default.freezeUser);
router
    .route('/forgot-password/')
    .post(user_controller_1.default.forgotPassword)
    .get(user_controller_1.default.showforgottenPassword);
router.get('/reset-password/:id/:token', user_controller_1.default.showResetPassword);
router.post('/reset-password/', user_controller_1.default.resetPassword);
//Authenticated routes
router.get('/profile/admin/', ensureAuthenticated, isAdmin, user_controller_1.default.showAdminProfile);
router.get('/profile/admin/search/', ensureAuthenticated, isAdmin, user_controller_1.default.search);
router.get('/profile/', ensureAuthenticated, user_controller_1.default.showProfile);
exports.default = router;
