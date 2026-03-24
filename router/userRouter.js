const express = require('express');
const {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  getUsers,
} = require('../controller/userController');
const { signUp, login } = require('../controller/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUp);
usersRouter.post('/login', login);

usersRouter.route('/').get(getAllUsers).post(createUsers);
usersRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers);

module.exports = usersRouter;
