const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign(
    { id }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN } // expire
  );
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Step 1: email আর password আছে কিনা
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Step 2: user আছে কিনা — password সহ আনো
  const user = await User.findOne({ email }).select('+password');
  console.log(user);

  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Step 3: password correct কিনা
  const isCorrect = user.correctPassword(password, user.password);

  if (!isCorrect) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Step 4: token বানাও আর পাঠাও
  const token = signToken(user._id);

  // password response এ আসবে না
  //   user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Step 1: Token আছে কিনা check করো
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // 'Bearer eyJhbGc...' → 'eyJhbGc...'
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  //   // Step 2: Token verify করো
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   // decoded = { id: '65f1a2b3...', iat: 1709728000, exp: 1712320000 }
  //   console.log(decoded);

  //   // Step 3: User এখনো আছে কিনা
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  //   // Step 4: Password change হয়েছে কিনা
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again', 401)
    );
  }

  //   // Step 5: req.user এ save করো
  req.user = currentUser;
  next();
});

// authController.js
exports.restrictTo = (...roles) => {
  // roles = ['admin', 'lead-guide']

  return (req, res, next) => {
    // req.user.role = protect middleware এ set হয়েছে
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
