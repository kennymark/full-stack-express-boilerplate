import db from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import bcrypt from 'bcryptjs'

const Schema = db.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    select: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  provider: String,
  website: String,
  twitterId: String,
  googleId: String,
  facebookId: String,
  githubId: String,
  gender: String,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

userSchema.plugin(paginate);

userSchema.pre('save', async function(next) {
  if (this.password) {
    let hash = await bcrypt.hash(this.password, 10)
    this.password = hash
  }
  next()
})

// userSchema.pre('update', async function(next) {
//   const hash = await bcrypt.hash(this.password, 10)
//   if (this.password) {
//     this.password = hash
//     this.updated_at = new Date()
//   } else if (!this.password) next()

// })

userSchema.statics.isValidPassword = async function(password) {
  await bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) console.log(err)
    return isMatch
  })
}


export default db.model('user', userSchema)