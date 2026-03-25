const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    maxlength: [50, 'Name must be at most 50 characters'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // ← automatically lowercase করবে
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },

  photo: {
    type: String, // ← image এর path/url
    default: 'default.jpg',
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // ← response এ কখনো আসবে না
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // password আর passwordConfirm same কিনা check
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },

  passwordChangedAt: Date, // ← কখন password change হয়েছে
  passwordResetToken: String, // ← reset token
  passwordResetExpires: Date, // ← token কতক্ষণ valid
  active: {
    type: Boolean,
    default: true,
    select: false, // ← response এ আসবে না
  },
});

// document middleware
// save হওয়ার আগে password hash করো
userSchema.pre('save', async function () {
  // password change না হলে skip
  if (!this.isModified('password')) return;

  this.passwordChangedAt = Date.now() - 1000; // ← automatically set হবে

  // password hash করো — 12 = cost factor
  this.password = await bcrypt.hash(this.password, 12);

  // passwordConfirm database এ save করবো না
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // JWTTimestamp = decoded.iat = token বানানোর time

  if (this.passwordChangedAt) {
    // passwordChangedAt কে Unix timestamp এ convert করো
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    // token বানানোর time < password change time
    // মানে password পরে change হয়েছে
    return JWTTimestamp < changedTimestamp;
  }

  // passwordChangedAt নেই — password কখনো change হয়নি
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
