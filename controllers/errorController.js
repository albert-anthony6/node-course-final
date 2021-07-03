const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${
    err.keyValue.name || err.keyValue.email
  }. Please use another value.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please login again.', 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again.', 401);
const sendErrorProd = (err, res) => {
  // Operational errors can send an error message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //1) Log the error
    console.error('ERROR: ', err);
    // Unknown error: not to send error message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    // Handling invalid DB IDs
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    // Handling duplicate DB fields
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // Handling field validation errors
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    // Handling invalid token
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    // Handling expired token
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
  next();
};
