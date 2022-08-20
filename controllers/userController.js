//Users Controllers
const User = require('../models/userModel');
const catchAsync = require('../Utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.greateUser = (req, res) => {
  res.status(200).json({
    status: 'Not Defined',
    data: {
      message: 'This is not Defined Yet',
    },
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'Not Defined',
    data: {
      message: 'This is not Defined Yet',
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'Not Defined',
    data: {
      message: 'This is not Defined Yet',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'Not Defined',
    data: {
      message: 'This is not Defined Yet',
    },
  });
};
