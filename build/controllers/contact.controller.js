"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const email_controller_1 = __importDefault(require("./email.controller"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_controller_1 = require("./user.controller");
const routes_1 = require("../data/routes");
dotenv_1.default.config();
function receiveAndSend(req, res) {
    const { email, name, message, reason } = req.body;
    const emailData = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Support',
        template: 'contact',
        locals: { reason, message, name }
    };
    email_controller_1.default.send(emailData);
    res.redirect(user_controller_1.accountify(routes_1.Account.login));
}
exports.default = receiveAndSend;
