"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
var email_controller_1 = __importDefault(require("./email.controller"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function receiveAndSend(req, res) {
    var _a = req.body, email = _a.email, name = _a.name, message = _a.message, reason = _a.reason;
    var emailData = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Support',
        template: 'contact',
        locals: { reason: reason, message: message, name: name }
    };
    email_controller_1.default.send(emailData);
    res.redirect(req.baseUrl);
}
exports.default = receiveAndSend;
