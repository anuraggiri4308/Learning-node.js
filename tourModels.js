const mongoose = require('mongoose');
//creating MongooseSchema
const tourSchema = new mongoose.Schema(
  {
    // name: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //here second argument is the error string
      unique: true
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'S tour must have a difficulty']
    },
    ratingAverage: {
      type: Number,
      default: 4.5
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'] //required is a validator
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, //trim only be used with string and it will remove all the whitespace at the begining and the end
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAT: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  //to output virtual responsse
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//virtual properties - No need to define the data in the database which can be derived from one another. below we are making schema for duration in weeks so we will devide the duration by 7.below get function is geeter where we can pass callback function
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//creating mongoose model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
