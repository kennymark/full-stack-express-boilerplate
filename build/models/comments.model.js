"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    title: String,
    text: String,
    date: {
        type: Date,
        default: Date.now
    },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.default = mongoose_1.model('comment', commentSchema);