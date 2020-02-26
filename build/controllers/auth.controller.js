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
//@ts-nocheck
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_twitter_1 = require("passport-twitter");
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_facebook_1 = require("passport-facebook");
const passport_github_1 = require("passport-github");
const user_model_1 = __importDefault(require("../models/user.model"));
const messages_1 = __importDefault(require("../data/messages"));
require("dotenv/config");
//passport middle to handle user registration
passport_1.default.use('signup', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            return done(null, false, { message: messages_1.default.userAlreadyExists(user) });
        }
        else {
            const newUser = yield user_model_1.default.create({ email, password, name });
            return done(null, newUser, { message: messages_1.default.account_registered });
        }
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use('login', new passport_local_1.Strategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return done(null, false, { message: messages_1.default.user_not_found });
    }
    else {
        const isValid = yield user.validatePassword(password);
        if (isValid)
            return done(null, user, { message: messages_1.default.login_sucess });
        return done(null, false, { message: messages_1.default.invalid_password });
    }
})));
passport_1.default.use('twitter', new passport_twitter_1.Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWIITER_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ twitterId: profile.id });
    if (user)
        return done(null, user, { message: messages_1.default.login_sucess });
    socialStrategy(user, 'twitter');
})));
passport_1.default.use('google', new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ googleId: profile.id });
    socialStrategy(user, 'google');
})));
passport_1.default.use('facebook', new passport_facebook_1.Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ facebookId: profile.id });
    socialStrategy(user, 'facebook');
})));
passport_1.default.use('github', new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ githubId: profile.id });
    socialStrategy(user, 'github');
})));
function socialStrategy(user, service) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user)
            return done(null, user, { message: messages_1.default.login_sucess });
        else {
            const account = {
                name: profile.displayName,
                provider: profile.provider,
                gender: profile.gender,
                email: `${profile.name}@${service}.com`,
                website: profile._json.url
            };
            account[`${service}Id`] = profile.id;
            const newUser = yield user_model_1.default.create(account);
            return done(null, newUser, { message: messages_1.default.account_registered });
        }
    });
}
// used to serialize the user for the session
passport_1.default.serializeUser((user, done) => done(null, user.id));
// used to deserialize the user
passport_1.default.deserializeUser((id, done) => {
    user_model_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
exports.default = passport_1.default;
