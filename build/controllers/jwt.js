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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const messages_1 = __importDefault(require("../data/messages"));
class JwtConfig {
    extractAndVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = req.headers.authorization;
            if (!header)
                return res.redirect('/user/login');
            const token = header.split(' ')[1];
            const decoded = yield jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            next();
            if (!decoded)
                req.flash('error', messages_1.default.login_session_expired);
        });
    }
}
exports.default = new JwtConfig();
