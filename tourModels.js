const mongoose = require('mongoose');
const slugify = require('slugify');
//creating MongooseSchema
const tourSchema = new mongoose.Schema(
  {
    // name: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //here second argument is the error string
      unique: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], //validator minlength and maxlength works only on string
      minlength: [10, 'A tour name must have more or equal than 10 characters']
    },
    slug: String,
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
      required: [true, 'S tour must have a difficulty'],
      //enum is used to provide only values that we want(enum is only for strings)
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either easy medium, medium or hard'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
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
    secretTour: {
      type: Boolean,
      default: false
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
//Mongoose middleware (pre will run before an actual event)
//DOCUMENT MIDDLEWARE (it runs before .save() and .create() command)
tourSchema.pre('save', function(next) {
  // console.log(this); //this will point to currently processed document thats why it is called document middleware
  this.slug = slugify(this.name, { lower: true });
  next();
});
//post middleware do not have only access to next but it has access to document also
//post middleware will be executed after all pre middleware is completed
// tourSchema.post('save', function(doc, next) {
//   console.log(doc); //doc is finished document
//   next();
// });

//QUERY MIDDLEWARE - runs before and after certain query is executed
//eg- middleware that will run before find query is executed (prefind hook)
tourSchema.pre(/^find/, function(next) {
  //   // tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});
//creating mongoose model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
