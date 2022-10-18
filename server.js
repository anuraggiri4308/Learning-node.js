const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//use the object in the second parameter to depricate some of the warnings also mongoose.connect() returns a promise so we will have to resolve it with the then method
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

//creating MongooseSchema
const tourSchema = new mongoose.Schema({
  // name: String,
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //here second argument is the error string
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'] //required is a validator
  }
});

//creating mongoose model
const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
