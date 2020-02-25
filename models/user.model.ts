import { Schema, model, Error } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import bcrypt from 'bcryptjs'


const userSchema = new Schema({
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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true })

userSchema.plugin(paginate);

userSchema.pre('save', async function save(next) {
  const user = this
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    //@ts-ignore
    this.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});


userSchema.methods.validatePassword = async function validatePassword(pass) {
  return bcrypt.compare(pass, this.password);
};




export default model('user', userSchema)