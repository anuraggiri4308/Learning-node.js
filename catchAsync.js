module.exports = fn => {
  //new annonimous function
  return (req, res, next) => {
    //we added return as a new function because catchAsync will no longer have access to req,res and next
    fn(req, res, next).catch(err => next(err)); //next(err) we are passing error to the global error handler
  };
};
