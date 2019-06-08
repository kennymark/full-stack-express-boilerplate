import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isConfirmed: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  provider: String,
  website: String,
  twitterId: String,
  googleId: String,
  facebookId: String,
  githubId: String,
  gender: String,
  resetToken: String,
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

userSchema.pre('update', async function(next) {
  if (this.password) {
    let hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    this.updated_at = new Date()
  }
  next()
})


userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  console.log('this', this)
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}


export default mongoose.model('user', userSchema)