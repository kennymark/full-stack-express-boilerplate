"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var commentSchema = new mongoose_1.Schema({
    title: String,
    text: String,
    date: {
        type: Date,
        default: Date.now
    },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.default = mongoose_1.model('comment', commentSchema);
