import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: false },
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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true })

userSchema.plugin(paginate);

userSchema.pre('save', async function (next) {
  //@ts-ignore
  if (this.password) {
    //@ts-ignore
    let hash = await bcrypt.hash(this.password, 10)
    //@ts-ignore
    this.password = hash
  }
  next()
})


userSchema.methods.isValidPassword = async function (password: string) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}




export default model('user', userSchema)