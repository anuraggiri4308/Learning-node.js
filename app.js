const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//handling unhandled routes
//below code is a middleware (THIS SHOULD BE THE LAST PART BECAUSE ITS A MIDDLEWARE AND IT ONLY EXECUTES IF THE PROVIDED ROUTE WILL NOT MATCH WITH LINE 28 AND 29)
app.all('*', (req, res, next) => {
  // * means it will handle all the verbs (http methods)
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!` //req.originalUrl will give you the http route you provide
  });
});

module.exports = app;
