const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
// const {
//   getAllTours,
// } = require('../after-section-06/controllers/tourController');
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
////////////////
//sample
///////////////

/*
app.get('/', (req, res) => {
  res.status(200).json({ message: 'hi from server', app: 'Notorous' });
});
app.post('/', (req, res) => {
  res.send('This is a post method');
});
*/
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};
const getTourById = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id == id);
  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: `Given id ${id} not found`,
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};
const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  //we are mutating id to the object with all other body data
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id == id);
  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: `Given id ${id} not found`,
    });
  }
  // delete tours[`${id}`];
  tours.splice(`${id}`, 1);
  res.status(203).json({
    status: 'Success',
    message: `Id ${id} is deleted`,
  });
};
//update tours
const updateTours = (req, res) => {
  const id = req.params.id * 1;
  res.status(200).json({
    status: 'Success',
    message: `Id ${id} is updated`,
  });
};

//user route methods
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet implemented',
  });
};
const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet implemented',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet implemented',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet implemented',
  });
};
const updateUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet implemented',
  });
};

/*
//get all tours
app.get('/api/v1/tours', getAllTours);
//get tours by id
app.get('/api/v1/tours/:id', getTourById);
//post tours
app.post('/api/v1/tours', createTour);
//delete tours
app.delete('/api/v1/tours/:id', deleteTour);
//update tours
app.patch('/api/v1/tours/:id', updateTours);
*/

//routes
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//using Tours.route
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTourById).delete(deleteTour).patch(updateTours);

//using user routes
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUserById).delete(deleteUser).patch(updateUsers);

//server port
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
