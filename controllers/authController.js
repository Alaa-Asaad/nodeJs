const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    lastname,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  } = req.body;
  const newUser = await User.create({
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
    passwordChangedAt: passwordChangedAt,
    role: role,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if ther is email and password
  if (!email || !password) {
    return next(new AppError("Please proived password and email", 400));
  }
  //2) check if the user exists and  password match the user password
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassowrd(password, user.password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  //3) if everything is okay sign ,create ,send the token to user

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    },
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting the token and check of it's  there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("Your not logged in ,Please log in to get all tours!", 401)
    );
  }
  //2)verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERT);

  //3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("this user belonging to this Token no longer exists", 401)
    );
  }
  //4)chekc if user changed password after token sent back to him
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user change the password Recently please log in again", 401)
    );
  }

  //Grant Access to protected Route
  req.user = currentUser;
  next();
});

exports.restrictedTo =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError(
          "You must have the right access to performe this operation",
          403
        )
      );
    }
    next();
  };
