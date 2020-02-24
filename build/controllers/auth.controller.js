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
const passport_local_1 = __importDefault(require("passport-local"));
const passport_twitter_1 = __importDefault(require("passport-twitter"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_github_1 = __importDefault(require("passport-github"));
const user_model_1 = __importDefault(require("../models/user.model"));
const messages_1 = __importDefault(require("../data/messages"));
require("dotenv/config");
const { Strategy: localStrategy } = passport_local_1.default;
const { Strategy: twitterStrategy } = passport_twitter_1.default;
const { Strategy: googleStrategy } = passport_google_oauth2_1.default;
const { Strategy: facebookStrategy } = passport_facebook_1.default;
const { Strategy: githubStrategy } = passport_github_1.default;
//passport middle to handle user registration
passport_1.default.use('signup', new localStrategy({
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
passport_1.default.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    try {
        const validate = yield user.isValidPassword(password);
        if (!user) {
            return done(null, false, { message: messages_1.default.user_not_found });
        }
        if (!validate) {
            return done(null, false, { message: messages_1.default.invalid_password });
        }
        return done(null, user, { message: messages_1.default.account_registered });
    }
    catch (err) {
        return done(err, false);
    }
})));
passport_1.default.use('twitter', new twitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWIITER_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ twitterId: profile.id });
    if (user)
        return done(null, user, { message: messages_1.default.login_sucess });
    else {
        const twitterUser = {
            twitterId: profile.id,
            email: profile.username + '@twitter.com',
            name: profile.displayName,
            gender: profile.gender,
            provider: profile.provider,
        };
        const newUser = yield user_model_1.default.create(twitterUser);
        return done(null, newUser, { message: messages_1.default.account_registered });
    }
})));
passport_1.default.use('google', new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ googleId: profile.id });
    if (user)
        return done(null, user, { message: messages_1.default.login_sucess });
    else {
        const googleUser = {
            googleId: profile.id,
            email: profile.email,
            name: profile.displayName,
            gender: profile.gender,
            provider: profile.provider,
        };
        const newUser = yield user_model_1.default.create(googleUser);
        return done(null, newUser, { message: messages_1.default.account_registered });
    }
})));
passport_1.default.use('facebook', new facebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ facebookId: profile.id });
    if (user)
        return done(null, user, { message: messages_1.default.login_sucess });
    else {
        const fbUser = {
            facebookId: profile.id,
            name: profile.displayName,
            provider: profile.provider,
            gender: profile.gender,
            email: profile.name + '@facebook.com',
            website: profile._json.url
        };
        const newUser = yield user_model_1.default.create(fbUser);
        return done(null, newUser, { message: messages_1.default.account_registered });
    }
})));
passport_1.default.use('github', new githubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, (token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ githubId: profile.id });
    if (user)
        return done(null, user, { message: messages_1.default.login_sucess });
    else {
        const githubUser = {
            githubId: profile.id,
            name: profile.displayName,
            provider: profile.provider,
            gender: profile.gender,
            email: profile.username + '@github.com',
            website: profile._json.blog
        };
        const newUser = yield user_model_1.default.create(githubUser);
        return done(null, newUser, { message: messages_1.default.account_registered });
    }
})));
// used to serialize the user for the session
passport_1.default.serializeUser((user, done) => done(null, user.id));
// used to deserialize the user
passport_1.default.deserializeUser((id, done) => {
    user_model_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
exports.default = passport_1.default;
