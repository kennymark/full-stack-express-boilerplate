"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
var express_session_1 = __importDefault(require("express-session"));
var mongoose_1 = __importDefault(require("mongoose"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var Store = connect_mongo_1.default(express_session_1.default);
exports.default = {
    hbsConfig: {
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: {
            math: function (lvalue, operator, rvalue) {
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);
                return {
                    "+": lvalue + rvalue,
                    "-": lvalue - rvalue,
                }[operator];
            }
        }
    },
    sessionConfig: {
        secret: 'keyboard cat',
        resave: false,
        key: 'sid',
        cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
        saveUninitialized: false,
        store: new Store({
            mongooseConnection: mongoose_1.default.connection
        })
    },
    dbOptions: {
        useNewUrlParser: true,
        useFindAndModify: false,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        keepAlive: 300000,
    },
    jwtSecret: 'God bless america',
    jwtOptions: {
        expiresIn: '2 days',
        issuer: 'Kenny Mark'
    }
};
