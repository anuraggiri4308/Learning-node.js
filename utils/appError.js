class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //message is only the parameter that built in error accepts
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOpertaional = true;
    Error.captureStackTrace(this, this.constructor); //same as err.stack (app.js line46)
  }
}
module.exports = AppError;
