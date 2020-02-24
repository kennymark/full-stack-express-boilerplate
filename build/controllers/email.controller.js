"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var nodemailer_sendgrid_transport_1 = __importDefault(require("nodemailer-sendgrid-transport"));
var email_templates_1 = __importDefault(require("email-templates"));
var path_1 = __importDefault(require("path"));
var _a = process.env, SENDGRID_USERNAME = _a.SENDGRID_USERNAME, SENDGRID_API_KEY = _a.SENDGRID_API_KEY, EMAIL_FROM = _a.EMAIL_FROM;
var options = {
    auth: {
        api_user: SENDGRID_USERNAME,
        api_key: SENDGRID_API_KEY
    }
};
var Hermes = /** @class */ (function () {
    function Hermes() {
    }
    Hermes.prototype.send = function (_a) {
        var to = _a.to, locals = _a.locals, template = _a.template, subject = _a.subject;
        var email = new email_templates_1.default({
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
        return email.send({ template: template, locals: locals, message: { to: to, subject: subject, } });
    };
    return Hermes;
}());
exports.default = new Hermes();
