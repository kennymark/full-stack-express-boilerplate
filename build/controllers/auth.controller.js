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
//@ts-nocheck
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = __importDefault(require("passport-local"));
var passport_twitter_1 = __importDefault(require("passport-twitter"));
var passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
var passport_facebook_1 = __importDefault(require("passport-facebook"));
var passport_github_1 = __importDefault(require("passport-github"));
var user_model_1 = __importDefault(require("../models/user.model"));
var messages_1 = __importDefault(require("../data/messages"));
require("dotenv/config");
var localStrategy = passport_local_1.default.Strategy;
var twitterStrategy = passport_twitter_1.default.Strategy;
var googleStrategy = passport_google_oauth2_1.default.Strategy;
var facebookStrategy = passport_facebook_1.default.Strategy;
var githubStrategy = passport_github_1.default.Strategy;
//passport middle to handle user registration
passport_1.default.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var name, user, newUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                name = req.body.name;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/, done(null, false, { message: messages_1.default.userAlreadyExists(user) })];
            case 2: return [4 /*yield*/, user_model_1.default.create({ email: email, password: password, name: name })];
            case 3:
                newUser = _a.sent();
                return [2 /*return*/, done(null, newUser, { message: messages_1.default.account_registered })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                done(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }));
passport_1.default.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, validate, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, user.isValidPassword(password)];
            case 3:
                validate = _a.sent();
                if (!user) {
                    return [2 /*return*/, done(null, false, { message: messages_1.default.user_not_found })];
                }
                if (!validate) {
                    return [2 /*return*/, done(null, false, { message: messages_1.default.invalid_password })];
                }
                return [2 /*return*/, done(null, user, { message: messages_1.default.account_registered })];
            case 4:
                err_1 = _a.sent();
                return [2 /*return*/, done(err_1, false)];
            case 5: return [2 /*return*/];
        }
    });
}); }));
passport_1.default.use('twitter', new twitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWIITER_CALLBACK_URL
}, function (token, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, twitterUser, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.default.findOne({ twitterId: profile.id })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/, done(null, user, { message: messages_1.default.login_sucess })];
            case 2:
                twitterUser = {
                    twitterId: profile.id,
                    email: profile.username + '@twitter.com',
                    name: profile.displayName,
                    gender: profile.gender,
                    provider: profile.provider,
                };
                return [4 /*yield*/, user_model_1.default.create(twitterUser)];
            case 3:
                newUser = _a.sent();
                return [2 /*return*/, done(null, newUser, { message: messages_1.default.account_registered })];
        }
    });
}); }));
passport_1.default.use('google', new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function (token, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, googleUser, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.default.findOne({ googleId: profile.id })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/, done(null, user, { message: messages_1.default.login_sucess })];
            case 2:
                googleUser = {
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.displayName,
                    gender: profile.gender,
                    provider: profile.provider,
                };
                return [4 /*yield*/, user_model_1.default.create(googleUser)];
            case 3:
                newUser = _a.sent();
                return [2 /*return*/, done(null, newUser, { message: messages_1.default.account_registered })];
        }
    });
}); }));
passport_1.default.use('facebook', new facebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL
}, function (token, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, fbUser, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.default.findOne({ facebookId: profile.id })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/, done(null, user, { message: messages_1.default.login_sucess })];
            case 2:
                fbUser = {
                    facebookId: profile.id,
                    name: profile.displayName,
                    provider: profile.provider,
                    gender: profile.gender,
                    email: profile.name + '@facebook.com',
                    website: profile._json.url
                };
                return [4 /*yield*/, user_model_1.default.create(fbUser)];
            case 3:
                newUser = _a.sent();
                return [2 /*return*/, done(null, newUser, { message: messages_1.default.account_registered })];
        }
    });
}); }));
passport_1.default.use('github', new githubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, function (token, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, githubUser, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.default.findOne({ githubId: profile.id })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/, done(null, user, { message: messages_1.default.login_sucess })];
            case 2:
                githubUser = {
                    githubId: profile.id,
                    name: profile.displayName,
                    provider: profile.provider,
                    gender: profile.gender,
                    email: profile.username + '@github.com',
                    website: profile._json.blog
                };
                return [4 /*yield*/, user_model_1.default.create(githubUser)];
            case 3:
                newUser = _a.sent();
                return [2 /*return*/, done(null, newUser, { message: messages_1.default.account_registered })];
        }
    });
}); }));
// used to serialize the user for the session
passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
// used to deserialize the user
passport_1.default.deserializeUser(function (id, done) {
    user_model_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
exports.default = passport_1.default;
