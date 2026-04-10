const express = require('express');
const {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  getUsers,
  updateMe,
  deleteMe,
} = require('../controller/userController');
const {
  signUp,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controller/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUp);
usersRouter.post('/login', login);

usersRouter.post('/forgetPassword', forgetPassword);
usersRouter.patch('/resetPassword/:token', resetPassword);
usersRouter.patch('/updateMyPassword', protect, updatePassword);
usersRouter.patch('/updateMe', protect, updateMe);
usersRouter.delete('/deleteMe', protect, deleteMe);

usersRouter.route('/').get(getAllUsers).post(createUsers);
usersRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers);

module.exports = usersRouter;
