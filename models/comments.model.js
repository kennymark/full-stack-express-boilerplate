import db from 'mongoose'

const commentSchema = new db.Schema({
	title: String,
	text: String,
	date: {
		type: Date,
		default: Date.now
	},
	author: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default db.model('comment', commentSchema)
