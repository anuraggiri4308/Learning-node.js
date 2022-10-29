// const fs = require('fs');
const Tour = require('./../models/tourModels');

//to import the data as a json file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    //BUILDING QUERY

    //FILTERING(1A)
    const queryObj = { ...req.query }; //we dont want to delete anything from original object so we are using destructuring same as object.assign
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    console.log(req.query, queryObj); //it will return query from the postman (returns object)

    //1-normal mongodb filter method
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // }); //find method without any argument will read all the data it will return an array

    //using REQ.QUERY
    // const tours = await Tour.find(queryObj); //now if we want other query like sort and all then what waits do here is it will send the initial query after sometime so to resolve it we will add this to a query variable and await that query variable in the last see the code below.

    //ADVANCED FILTERING(1B)
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    //mongo db query for greater than {difficulty:'easy',duration:{$gte:5}}
    //{ difficulty: 'easy' ,duration: { gte: '5' } }  //output from req.query if we give greater than in the query, only doller sign is missing in the duration value so we will add it
    console.log(JSON.parse(queryString));

    let query = Tour.find(JSON.parse(queryString));

    //SORTING(2)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //http://localhost:3000/api/v1/tours?sort=-price,ratingsAverage
      // query = query.sort(req.query.sort);  //http://localhost:3000/api/v1/tours?sort=-price
      query = query.sort(sortBy);
      console.log(sortBy);
      //sort('price' ratings) sso if two prices are same we need to sort based on ratings
    }
    //if user has not specified any sortings params
    else {
      query = query.sort('-createdAt');
    }

    //FIELD LIMITING(3)   //http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //it will exclude the v from the json data it is added by mongoose by default
    }

    //PAGINATION (4)  //http://localhost:3000/api/v1/tours?page=1&limit=3

    const page = req.query.page * 1 || 1; //default page no is 1
    const limit = req.query.limit * 1 || 100; //default limit is 100
    const skip = (page - 1) * limit;
    //page=2&limit=10 , 1-10 page 1 , 11-20 page 2
    // query = query.skip(10).limit(10); //we need to skip 10 result to get to result no 11 on page 2 (for page=3 we have to skip 20 results)
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments(); //it will count no of items
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //EXECUTE QUERY
    const tours = await query;
    //query.sort().select().skip().limit()  all the query is returning a new query so we can chain them
    //2-mongoose method
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne( {_id : req.params.id})  it is a mongodb method which works same as above line (underscore id because in mongodb id looks like underscore id)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body); //.create() method works similar to line 50 and 51

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //this will return the updated document
      reunValidators: true //this will run schema validator (if we setprice to string then it will give error)
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};

//postman query http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
