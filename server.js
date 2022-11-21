const dotenv = require('dotenv');
const mongoose = require('mongoose');

//uncaught exception
//we kept it in top because if there is an issue then this exception will be caught first. (suppose we have console.log(x) in line 20 and x is not defined and this code is after that so the exception will not be caught so we kept it on top  )
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 🧧 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
  // server.close(() => {
  //   process.exit(1); //during uncaught exception we need to exit the application, we may skip in the unhandled rejection but in uncaught exception it is mandatory
  // });
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//use the object in the second parameter to depricate some of the warnings also mongoose.connect() returns a promise so we will have to resolve it with the then method
/*
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections);
    console.log('DB connection is successful');
  });
  */

//local connection running now
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections);
    console.log('DB connection is successful');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//global unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION 🧧 Shutting down...');
  console.log(err.name, err.message);
  //its not a good practice to close the application directly so we are closing the server first (server coming from line 37)
  server.close(() => {
    process.exit(1); //0 for success and  for unhandled exception})
  });
});
