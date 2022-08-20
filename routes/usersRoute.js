const express = require('express');
const {
  getAllUsers,
  getUser,
  greateUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { signup, login } = require('../controllers/authController');

const userRoute = express.Router();

userRoute.route('/').get(getAllUsers).post(greateUser);
userRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

module.exports = userRoute;
