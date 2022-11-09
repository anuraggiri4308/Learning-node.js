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
    sendErrorProd(err, res);
  }
};
