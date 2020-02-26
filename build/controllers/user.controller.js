"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("../config/config"));
const messages_1 = __importDefault(require("../data/messages"));
const user_model_1 = __importDefault(require("../models/user.model"));
const email_controller_1 = __importDefault(require("./email.controller"));
const util_1 = require("../config/util");
const routes_1 = require("../data/routes");
class UserController {
    showLogin(req, res) {
        res.render('account/login', { title: 'Login', });
    }
    showRegister(req, res) {
        res.render('account/register', { title: 'Register', });
    }
    showProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const user = yield user_model_1.default.findById(req.user.id);
            return res.render('account/profile', { title: 'Profile', user });
        });
    }
    showforgottenPassword(req, res) {
        res.render('account/forgot-password', { title: ' Forgotten password' });
    }
    showResetPassword(req, res) {
        res.render('account/reset-password', { title: 'Reset Password', params: req.params });
    }
    showAdminProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = req.query.page || 1;
            const activeUsers = yield user_model_1.default.find({ is_active: true });
            const deletedUsers = yield user_model_1.default.find({ is_deleted: true });
            const result = yield user_model_1.default.paginate({ is_deleted: false }, { page, limit: 10 });
            res.render('admin', { title: 'Admin Page', data: result, deletedUsers, activeUsers });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, query } = req.query;
            const page = req.query.page || 1;
            const result = yield user_model_1.default.paginate({ [query]: new RegExp(`${search}`, 'i') }, { page, limit: 10 });
            console.log(result);
            return res.render('admin', { title: 'Admin Page', data: result });
        });
    }
    socialLogin() {
        console.log('socials tho');
    }
    localLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("login", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("error", info.message);
                    return res.redirect(accountify('login'));
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    req.flash("message", info.message);
                    res.redirect(accountify('profile'));
                });
            })(req, res, next);
        });
    }
    logUserOut(req, res) {
        req.logout();
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    twitterLogin(req, res, next) {
        loginWithSocial('twitter', req, res, next);
    }
    facebookLogin(req, res, next) {
        loginWithSocial('facebook', req, res, next);
    }
    githubLogin(req, res, next) {
        loginWithSocial('github', req, res, next);
    }
    googleLogin(req, res, next) {
        loginWithSocial('google', req, res, next);
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleteParams = { is_deleted: true, is_active: false };
            const user = yield user_model_1.default.findOneAndUpdate(id, deleteParams);
            req.flash('message', messages_1.default.account_deleted);
            if (user.is_admin) {
                res.redirect(accountify('profile/admin'));
            }
            else {
                req.logout();
                req.flash('error', messages_1.default.account_deleted);
                req.session.destroy(err => res.redirect('/'));
            }
        });
    }
    freezeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield user_model_1.default.findOneAndUpdate(id, { is_active: false });
            req.flash('message', messages_1.default.account_frozen);
            req.logout();
            res.redirect('/');
        });
    }
    showEdituser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield user_model_1.default.findById(id);
                if (user) {
                    res.render('account/edit-user', { data: user });
                }
            }
            catch (error) {
                req.flash('error', error);
                res.render('home');
            }
        });
    }
    updateUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { user: id } = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport;
            try {
                yield user_model_1.default.findByIdAndUpdate(id, req.body);
                req.flash('message', messages_1.default.user_updated);
                res.redirect(accountify('profile/'));
            }
            catch (error) {
                req.flash('error', messages_1.default.user_update_error);
                res.redirect('/');
            }
        });
    }
    updateUserByAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield user_model_1.default.findByIdAndUpdate(id, req.body);
                req.flash('message', messages_1.default.user_updated);
                res.redirect(accountify('profile/admin'));
            }
            catch (error) {
                req.flash('error', messages_1.default.user_update_error);
                res.redirect(accountify('profile/admin'));
            }
        });
    }
    updateUserPassword(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { user: id } = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport;
            const { password } = req.body;
            const user = yield user_model_1.default.findByIdAndUpdate(id, { password });
            if (user) {
                req.flash('message', messages_1.default.user_updated);
                res.redirect(accountify('profile/'));
            }
            else {
                req.flash('error', messages_1.default.general_error);
                res.redirect(accountify('profile/'));
            }
        });
    }
    postRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, } = req.body;
            req.checkBody('name', messages_1.default.validation_errors.name).isLength({ min: 5 }).notEmpty();
            req.checkBody('email', messages_1.default.validation_errors.emailNotEmpty).isEmail();
            req.checkBody('password', messages_1.default.validation_errors.password).isLength({ min: 5 }).notEmpty();
            const link = `${util_1.getUrl(req)}/account/login`;
            const emailInfo = {
                to: email,
                template: 'welcome',
                subject: 'Thanks for signing up with',
                locals: { name, company_name: process.env.APP_NAME, link }
            };
            if (req.validationErrors()) {
                req.flash('validationErrors', req.validationErrors());
                return res.redirect(accountify('register'));
            }
            passport_1.default.authenticate('signup', (err, user, info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    req.flash('message', info.message);
                    yield email_controller_1.default.send(emailInfo);
                    return res.redirect('/');
                }
                catch (err) {
                    req.flash('message', info.message);
                    res.redirect(accountify(routes_1.Account.register + info.message));
                }
            }))(req, res);
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (user) {
                const token = yield jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwtSecret, { expiresIn: '1h' });
                const { id, name, email } = user;
                yield user_model_1.default.findByIdAndUpdate(id, { resetToken: token });
                const emailInfo = {
                    to: email,
                    subject: 'Reset Password',
                    template: 'password-reset',
                    locals: {
                        name: name,
                        link: `${util_1.getUrl(req)}/account/reset-password/${id}/${token}`
                    }
                };
                sendEmail(req, res, user, emailInfo);
            }
            else {
                req.flash('error', messages_1.default.user_not_found);
                res.redirect(accountify(routes_1.Account.forgot_password));
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, token, password, new_password } = req.body;
            req.checkBody("password", "Password must be at least 5 characters long").isLength({ min: 4 });
            req.checkBody("new_password", "Passwords do not match").equals(new_password);
            const errors = req.validationErrors();
            if (errors) {
                req.flash('validationErrors', errors);
                res.redirect(accountify(routes_1.Account.password_reset));
            }
            const user = yield user_model_1.default.findById(id);
            const tokenValid = yield jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            console.log({ tokenValid, password, new_password, token, id });
            if (tokenValid && user) {
                user.password = password;
                user.resetToken = null;
                const savedUser = yield user.save();
                const emailInfo = {
                    to: savedUser.email,
                    subject: 'Password reset succesful',
                    template: 'password-reset/success',
                    locals: {
                        name: savedUser.name,
                        link: `${util_1.getUrl(req)}/account/login`
                    }
                };
                yield email_controller_1.default.send(emailInfo);
                req.flash('message', messages_1.default.password_reset_success);
                res.redirect(accountify(routes_1.Account.login));
            }
            else {
                req.flash('error', messages_1.default.reset_token_expired);
                res.redirect(accountify(routes_1.Account.password_reset));
            }
        });
    }
}
function accountify(route) {
    return `/account/${route}`;
}
exports.accountify = accountify;
function sendEmail(req, res, user, emailInfo) {
    email_controller_1.default.send(emailInfo)
        .then((x) => {
        req.flash('message', messages_1.default.passwordResetSuccess(user));
        return res.redirect(accountify(routes_1.Account.login));
    })
        .catch((err) => console.log(err));
}
function loginWithSocial(social, req, res, next) {
    return passport_1.default.authenticate(social, (err, user, _info) => {
        try {
            req.login(user, err => res.redirect(accountify(routes_1.Account.login)));
        }
        catch (error) {
            req.flash('error', messages_1.default.login_failure);
            res.redirect('/user/login');
            return next(error);
        }
    })(req, res, next);
}
exports.default = new UserController();
