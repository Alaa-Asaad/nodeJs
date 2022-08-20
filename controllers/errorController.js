const AppError = require('../Utils/appError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const handleCastErrorDB = (err) => {
    const message = `Input Invaild ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  const handleValidationErrorDB = (err) => {
    const errorsMessage = Object.values(err.errors).map((el) => el.message);

    const meassage = `Validation error that ${errorsMessage.join('. ')}`;
    return new AppError(meassage, 400);
  };
  const handleDuplcateNameDB = (err) => {
    const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/);
    const meassage = `Duplicate Name Field ${value[0]} must be Uniqe `;
    return new AppError(meassage, 400);
  };
  const handleJsonWebTokenError = () =>
    new AppError('Please log in ,Invaild Token', 401);

  const handleJWTExpiredError = () =>
    new AppError('The Token Expired Please login again', 401);

  const sendErrorDev = (err, res) => {
    console.log(err.isOperational);
    //Error that we can send to Client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    } else {
      //Error that we don't want to send to Client like Programming Error
      // console.error(err);
      res.status(500).json({
        error: err,
        status: 'error',
        message: 'Something got very worng',
      });
    }
  };

  const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errors = err.name;
    const errorCode = err.code;

    if (errors === 'CastError') errors = handleCastErrorDB(err);
    if (errorCode === 11000) errors = handleDuplcateNameDB(err);
    if (errors === 'ValidationError') errors = handleValidationErrorDB(err);
    if (errors === 'JsonWebTokenError') errors = handleJsonWebTokenError();
    if (errors === 'TokenExpiredError') errors = handleJWTExpiredError();
    sendErrorProd(errors, res);
  }
};
