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
            let pagesArr = [];
            res.render('admin', {
                title: 'Admin Page',
                // pages: pagesArr,
                data: result,
                deletedUsers,
                activeUsers
            });
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
    localLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('login', (err, user, _info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err || !user)
                        return res.render('account/login', { error: messages_1.default.user_not_found });
                    req.login(user, _ => {
                        if (user.is_admin)
                            return res.redirect('/user/profile/admin/');
                        if (user.is_deleted) {
                            req.flash('error', messages_1.default.user_not_found);
                            return res.redirect('/user/register');
                        }
                        return res.redirect('/user/profile/');
                    });
                }
                catch (error) {
                    return next(error);
                }
            }))(req, res, next);
        });
    }
    logUserOut(req, res) {
        req.logout();
        res.redirect('/');
    }
    twitterLogin(req, res, next) {
        this.socials();
        passport_1.default.authenticate('twitter', (err, user, _info) => {
            try {
                req.login(user, err => res.redirect('/user/profile/'));
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    }
    socials() {
        console.log('sociaalss', new Date());
    }
    facebookLogin(req, res, next) {
        passport_1.default.authenticate('facebook', (_err, user, _info) => {
            try {
                req.login(user, err => res.redirect('/user/profile/'));
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    }
    githubLogin(req, res, next) {
        passport_1.default.authenticate('github', (_err, user, _info) => {
            try {
                req.login(user, err => res.redirect('/user/profile/'));
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    }
    googleLogin(req, res, next) {
        passport_1.default.authenticate('google', (_err, user, _info) => {
            try {
                req.login(user, err => res.redirect('/user/profile/'));
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleteParams = { is_deleted: true, is_active: false };
            // if (!id) {
            //   await userModel.findOneAndUpdate(req.user.id, deleteParams)
            //   req.flash('message', messages.account_deleted)
            //   req.logout()
            //   res.redirect('/')
            // }
            const user = yield user_model_1.default.findOneAndUpdate(id, deleteParams);
            req.flash('message', messages_1.default.account_deleted);
            console.log(user);
            res.redirect('/user/profile/admin');
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
                res.redirect('/user/profile/');
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
                res.redirect('/user/profile/admin');
            }
            catch (error) {
                req.flash('error', messages_1.default.user_update_error);
                res.redirect('/user/profile/admin');
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
                res.redirect('/user/profile/');
            }
            else {
                req.flash('error', messages_1.default.general_error);
                res.redirect('/user/profile/');
            }
        });
    }
    postRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.checkBody('name', 'Name should be greater than 5 characters').isLength({ min: 5 });
            req.checkBody('name', 'Name cannot be empty').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('password', 'Password should be greater than 5 characters').isLength({ min: 5 });
            req.checkBody('password', 'Password is show not be empty').notEmpty();
            if (req.validationErrors()) {
                //@ts-ignore
                req.flash('validationErrors', req.validationErrors());
                return res.redirect('/user/register');
            }
            passport_1.default.authenticate('signup', (err, user, info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    req.flash('message', info.message);
                    return res.redirect('/');
                }
                catch (err) {
                    req.flash('message', info.message);
                    res.redirect('/user/register?' + info.message);
                }
            }))(req, res);
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            const fullUrl = req.protocol + '://' + req.get('host');
            if (user) {
                const token = yield jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwtSecret, { expiresIn: '1h' });
                const { id, name, email } = user;
                yield user_model_1.default.findByIdAndUpdate(id, { resetToken: token });
                const emailData = {
                    to: email,
                    subject: 'Reset Password',
                    template: 'password-reset',
                    locals: {
                        name: name,
                        link: `${fullUrl}/user/reset-password/${id}/${token}`
                    }
                };
                email_controller_1.default.send(emailData)
                    .then((x) => {
                    console.log(x.text);
                    req.flash('message', messages_1.default.passwordResetSuccess(user));
                    res.redirect('/user/login');
                })
                    .catch((x) => {
                    req.flash('error', x);
                    console.log(x);
                    res.redirect('/user/forgot-password');
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, new_password, id, token } = req.body;
            req.checkBody('password', 'Password is show not be empty').notEmpty();
            req.checkBody('new_password', 'Password is show not be empty').notEmpty();
            req.checkBody('password', 'Password should be greater than 5 characters').isLength({ min: 5 });
            req.checkBody('password', 'Make ensure the passwords match').equals(new_password);
            const validationErrors = req.validationErrors();
            if (validationErrors) {
                //@ts-ignore
                req.flash('validationErrors', validationErrors);
                res.redirect('/user/login');
            }
            else {
                console.log({ id, token });
                const user = yield user_model_1.default.findById(id);
                if (user.resetToken) {
                    const isTokenValid = yield jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
                    if (isTokenValid) {
                        //@ts-ignore
                        yield user_model_1.default.findOneAndUpdate({ password });
                        req.flash('message', messages_1.default.password_reset_success);
                        res.redirect('/user/login');
                    }
                    else {
                        req.flash('error', messages_1.default.password_reset_fail);
                        res.redirect('/user/login');
                    }
                }
            }
        });
    }
}
exports.default = new UserController();
