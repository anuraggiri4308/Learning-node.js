const mongoose = require('mongoose');
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

module.exports = Tour;
