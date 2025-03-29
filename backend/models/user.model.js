import mongoose from 'mongoose';
import validator from 'validator'
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide a username"],
    unique: true,
    trim: true,
    minlength: [3, "username can not be less than 3 characters"],
    maxlength: [20, "username can not be more than 20 characters"],
    index: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please provide a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },

  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;