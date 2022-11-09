module.exports = (err, req, res, next) => {
  //by specifying (err,req,res,next) these 4 parameters express knows that it is error handling middleware
  // console.log(err.stack); //it will give us the location where the error happened
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message //message is coming from line 39
  });
};
