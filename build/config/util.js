"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const time = moment_1.default();
const date = time.format('MMMM Do YYYY');
/** This function make its possible to set data that is universally available in every template without
 * having to pass in data via the render method
 */
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
function logger(req, res, next) {
    const durationInMilliseconds = getDurationInMilliseconds(process.hrtime());
    console.info(`${req.method} - ${req.url} - ${durationInMilliseconds.toString()} ms`);
    next();
}
exports.logger = logger;
const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
function getUrl(req) {
    return `${req.protocol}://${req.get('host')}`;
}
exports.getUrl = getUrl;
