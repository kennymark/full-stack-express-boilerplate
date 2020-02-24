"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const time = moment_1.default();
const date = time.format('MMMM Do YYYY');
function setLocals(req, res, next) {
    res.locals.year = time.year();
    res.locals.date = date;
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.message = req.flash('message');
    res.locals.validationErrors = req.flash('validationErrors');
    next();
}
exports.setLocals = setLocals;
