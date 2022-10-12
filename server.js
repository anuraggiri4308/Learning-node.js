const dotenv = require('dotenv');
// console.log(app.get('env')); //prints development so we are in development env right now
dotenv.config({ path: './config.env' }); //read config file and save them into nodejs env variables
const app = require('./app');

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
