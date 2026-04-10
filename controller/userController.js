const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// users function
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    returnDocument: 'after',
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

exports.updateUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

exports.deleteUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

exports.createUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};
