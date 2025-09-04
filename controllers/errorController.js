const AppError = require('../utils/appError');

const handelCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 404);
};
const handelDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handelJWTError = () => {
  return new AppError('Invalid token . please login again', 401);
};
const handelJWTExpiredError = () => {
  return new AppError('You token has expired! please login again', 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational , trusted error :sent message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown erorr : dont leak error details
  else {
    //1)log error
    console.error('Error', err);

    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handelValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handelJWTError();
    if (error.name === 'TokenExpiredError') error = handelJWTExpiredError();
    sendErrorProd(error, res);
  }
};
