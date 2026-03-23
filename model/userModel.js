const { default: mongoose } = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
