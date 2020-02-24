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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var passport_1 = __importDefault(require("passport"));
var config_1 = __importDefault(require("../config/config"));
var messages_1 = __importDefault(require("../data/messages"));
var user_model_1 = __importDefault(require("../models/user.model"));
var email_controller_1 = __importDefault(require("./email.controller"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.showLogin = function (req, res) {
        res.render('account/login', { title: 'Login', });
    };
    UserController.prototype.showRegister = function (req, res) {
        res.render('account/register', { title: 'Register', });
    };
    UserController.prototype.showProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.default.findById(req.user.id)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, res.render('account/profile', { title: 'Profile', user: user })];
                }
            });
        });
    };
    UserController.prototype.showforgottenPassword = function (req, res) {
        res.render('account/forgot-password', { title: ' Forgotten password' });
    };
    UserController.prototype.showResetPassword = function (req, res) {
        res.render('account/reset-password', { title: 'Reset Password', params: req.params });
    };
    UserController.prototype.showAdminProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var page, activeUsers, deletedUsers, result, pagesArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = req.query.page || 1;
                        return [4 /*yield*/, user_model_1.default.find({ is_active: true })];
                    case 1:
                        activeUsers = _a.sent();
                        return [4 /*yield*/, user_model_1.default.find({ is_deleted: true })];
                    case 2:
                        deletedUsers = _a.sent();
                        return [4 /*yield*/, user_model_1.default.paginate({ is_deleted: false }, { page: page, limit: 10 })];
                    case 3:
                        result = _a.sent();
                        pagesArr = [];
                        res.render('admin', {
                            title: 'Admin Page',
                            // pages: pagesArr,
                            data: result,
                            deletedUsers: deletedUsers,
                            activeUsers: activeUsers
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.search = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, search, query, page, result;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.query, search = _a.search, query = _a.query;
                        page = req.query.page || 1;
                        return [4 /*yield*/, user_model_1.default.paginate((_b = {}, _b[query] = new RegExp("" + search, 'i'), _b), { page: page, limit: 10 })];
                    case 1:
                        result = _c.sent();
                        console.log(result);
                        return [2 /*return*/, res.render('admin', { title: 'Admin Page', data: result })];
                }
            });
        });
    };
    UserController.prototype.localLogin = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                passport_1.default.authenticate('login', function (err, user, _info) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        try {
                            if (err || !user)
                                return [2 /*return*/, res.render('account/login', { error: messages_1.default.user_not_found })];
                            req.login(user, function (_) {
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
                            return [2 /*return*/, next(error)];
                        }
                        return [2 /*return*/];
                    });
                }); })(req, res, next);
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.logUserOut = function (req, res) {
        req.logout();
        res.redirect('/');
    };
    UserController.prototype.twitterLogin = function (req, res, next) {
        this.socials();
        passport_1.default.authenticate('twitter', function (err, user, _info) {
            try {
                req.login(user, function (err) { return res.redirect('/user/profile/'); });
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    };
    UserController.prototype.socials = function () {
        console.log('sociaalss', new Date());
    };
    UserController.prototype.facebookLogin = function (req, res, next) {
        passport_1.default.authenticate('facebook', function (_err, user, _info) {
            try {
                req.login(user, function (err) { return res.redirect('/user/profile/'); });
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    };
    UserController.prototype.githubLogin = function (req, res, next) {
        passport_1.default.authenticate('github', function (_err, user, _info) {
            try {
                req.login(user, function (err) { return res.redirect('/user/profile/'); });
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    };
    UserController.prototype.googleLogin = function (req, res, next) {
        passport_1.default.authenticate('google', function (_err, user, _info) {
            try {
                req.login(user, function (err) { return res.redirect('/user/profile/'); });
            }
            catch (error) {
                req.flash('error', messages_1.default.login_failure);
                res.redirect('/user/login');
                return next(error);
            }
        })(req, res, next);
    };
    UserController.prototype.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, deleteParams, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        deleteParams = { is_deleted: true, is_active: false };
                        return [4 /*yield*/, user_model_1.default.findOneAndUpdate(id, deleteParams)];
                    case 1:
                        user = _a.sent();
                        req.flash('message', messages_1.default.account_deleted);
                        console.log(user);
                        res.redirect('/user/profile/admin');
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.freezeUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, user_model_1.default.findOneAndUpdate(id, { is_active: false })];
                    case 1:
                        _a.sent();
                        req.flash('message', messages_1.default.account_frozen);
                        req.logout();
                        res.redirect('/');
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.showEdituser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, user_model_1.default.findById(id)];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            res.render('account/edit-user', { data: user });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        req.flash('error', error_1);
                        res.render('home');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.passport).user;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(id, req.body)];
                    case 2:
                        _b.sent();
                        req.flash('message', messages_1.default.user_updated);
                        res.redirect('/user/profile/');
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        req.flash('error', messages_1.default.user_update_error);
                        res.redirect('/');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUserByAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(id, req.body)];
                    case 2:
                        _a.sent();
                        req.flash('message', messages_1.default.user_updated);
                        res.redirect('/user/profile/admin');
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        req.flash('error', messages_1.default.user_update_error);
                        res.redirect('/user/profile/admin');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUserPassword = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, password, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.passport).user;
                        password = req.body.password;
                        return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(id, { password: password })];
                    case 1:
                        user = _b.sent();
                        if (user) {
                            req.flash('message', messages_1.default.user_updated);
                            res.redirect('/user/profile/');
                        }
                        else {
                            req.flash('error', messages_1.default.general_error);
                            res.redirect('/user/profile/');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.postRegister = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                req.checkBody('name', 'Name should be greater than 5 characters').isLength({ min: 5 });
                req.checkBody('name', 'Name cannot be empty').notEmpty();
                req.checkBody('email', 'Email is not valid').isEmail();
                req.checkBody('password', 'Password should be greater than 5 characters').isLength({ min: 5 });
                req.checkBody('password', 'Password is show not be empty').notEmpty();
                if (req.validationErrors()) {
                    //@ts-ignore
                    req.flash('validationErrors', req.validationErrors());
                    return [2 /*return*/, res.redirect('/user/register')];
                }
                passport_1.default.authenticate('signup', function (err, user, info) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        try {
                            req.flash('message', info.message);
                            return [2 /*return*/, res.redirect('/')];
                        }
                        catch (err) {
                            req.flash('message', info.message);
                            res.redirect('/user/register?' + info.message);
                        }
                        return [2 /*return*/];
                    });
                }); })(req, res);
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.forgotPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, fullUrl, token, id, name, email_1, emailData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.body.email;
                        return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        fullUrl = req.protocol + '://' + req.get('host');
                        if (!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, jsonwebtoken_1.default.sign({ email: user.email }, config_1.default.jwtSecret, { expiresIn: '1h' })];
                    case 2:
                        token = _a.sent();
                        id = user.id, name = user.name, email_1 = user.email;
                        return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(id, { resetToken: token })];
                    case 3:
                        _a.sent();
                        emailData = {
                            to: email_1,
                            subject: 'Reset Password',
                            template: 'password-reset',
                            locals: {
                                name: name,
                                link: fullUrl + "/user/reset-password/" + id + "/" + token
                            }
                        };
                        email_controller_1.default.send(emailData)
                            .then(function (x) {
                            console.log(x.text);
                            req.flash('message', messages_1.default.passwordResetSuccess(user));
                            res.redirect('/user/login');
                        })
                            .catch(function (x) {
                            req.flash('error', x);
                            console.log(x);
                            res.redirect('/user/forgot-password');
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, new_password, id, token, validationErrors, user, isTokenValid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, new_password = _a.new_password, id = _a.id, token = _a.token;
                        req.checkBody('password', 'Password is show not be empty').notEmpty();
                        req.checkBody('new_password', 'Password is show not be empty').notEmpty();
                        req.checkBody('password', 'Password should be greater than 5 characters').isLength({ min: 5 });
                        req.checkBody('password', 'Make ensure the passwords match').equals(new_password);
                        validationErrors = req.validationErrors();
                        if (!validationErrors) return [3 /*break*/, 1];
                        //@ts-ignore
                        req.flash('validationErrors', validationErrors);
                        res.redirect('/user/login');
                        return [3 /*break*/, 6];
                    case 1:
                        console.log({ id: id, token: token });
                        return [4 /*yield*/, user_model_1.default.findById(id)];
                    case 2:
                        user = _b.sent();
                        if (!user.resetToken) return [3 /*break*/, 6];
                        return [4 /*yield*/, jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret)];
                    case 3:
                        isTokenValid = _b.sent();
                        if (!isTokenValid) return [3 /*break*/, 5];
                        //@ts-ignore
                        return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ password: password })];
                    case 4:
                        //@ts-ignore
                        _b.sent();
                        req.flash('message', messages_1.default.password_reset_success);
                        res.redirect('/user/login');
                        return [3 /*break*/, 6];
                    case 5:
                        req.flash('error', messages_1.default.password_reset_fail);
                        res.redirect('/user/login');
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.default = new UserController();
