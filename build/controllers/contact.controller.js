"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const email_controller_1 = __importDefault(require("./email.controller"));
const dotenv_1 = __importDefault(require("dotenv"));
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
    res.redirect(req.baseUrl);
}
exports.default = receiveAndSend;
