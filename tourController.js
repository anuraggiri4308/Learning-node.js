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
    const query = Tour.find(queryObj);

    //2-mongoose method
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //EXECUTE QUERY
    const tours = await query;
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
