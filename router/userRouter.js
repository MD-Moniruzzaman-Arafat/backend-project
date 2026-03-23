const express = require('express');
const {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  getUsers,
} = require('../controller/userController');
const { signUp } = require('../controller/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUp);

usersRouter.route('/').get(getAllUsers).post(createUsers);
usersRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers);

module.exports = usersRouter;
