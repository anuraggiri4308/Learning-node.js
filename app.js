const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Mount routers
app.use('/api/v1/tours', tourRouter); //here tourRouter is a middleware
app.use('/api/v1/users', userRouter); //here userRouter is a middleware

//server port
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
