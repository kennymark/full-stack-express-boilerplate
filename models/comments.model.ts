import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
	title: String,
	text: String,
	date: {
		type: Date,
		default: Date.now
	},
	author: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default model('comment', commentSchema)
