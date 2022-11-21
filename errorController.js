const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; //regular expression to match text between quotes. [0] is used in the last to pick up first string means name
  const message = `Duplicate field value : ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//handling mongoose validation
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message); //errors is an object of all the error message

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message, //message is coming from line 39 of App.js
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  //operational, trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message //message is coming from line 39 of App.js
    });
    //programming orother unknown error:don't want to leak details to clients
  } else {
    //1)log error
    console.error('ERROR🎇', err);

    //2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
};
module.exports = (err, req, res, next) => {
  //by specifying (err,req,res,next) these 4 parameters express knows that it is error handling middleware
  // console.log(err.stack); //it will give us the location where the error happened
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
