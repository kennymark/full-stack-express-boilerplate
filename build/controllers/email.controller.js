"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_sendgrid_transport_1 = __importDefault(require("nodemailer-sendgrid-transport"));
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
const { SENDGRID_USERNAME, SENDGRID_API_KEY, EMAIL_FROM } = process.env;
const options = {
    auth: {
        api_user: SENDGRID_USERNAME,
        api_key: SENDGRID_API_KEY
    }
};
class Hermes {
    send({ to, locals, template, subject }) {
        const email = new email_templates_1.default({
            message: { from: EMAIL_FROM, },
            send: true,
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: true,
                    relativeTo: path_1.default.resolve('public')
                },
            },
            views: { options: { extension: 'hbs' } },
            transport: nodemailer_1.default.createTransport(nodemailer_sendgrid_transport_1.default(options)),
        });
        return email.send({ template, locals, message: { to, subject, } });
    }
}
exports.default = new Hermes();
