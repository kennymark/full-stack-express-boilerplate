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
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, maxlength: 100, unique: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: false, },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_confirmed: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    provider: { type: String, default: 'local' },
    pwd_change: { type: Boolean, default: false },
    website: String,
    twitterId: String,
    googleId: String,
    facebookId: String,
    githubId: String,
    gender: String,
    resetToken: String,
    account_confirmed: { type: Boolean, default: true, },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });
userSchema.plugin(mongoose_paginate_v2_1.default);
userSchema.pre('save', function save(next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!this.isModified('password'))
            return next();
        try {
            //@ts-ignore
            this.password = yield bcryptjs_1.default.hash(user.password, 10);
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
});
userSchema.methods.validatePassword = function validatePassword(pass) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(pass, this.password);
    });
};
exports.default = mongoose_1.model('user', userSchema);
