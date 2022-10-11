const express = require('express');
const fs = require('fs');
const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
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

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).delete(deleteTour).patch(updateTours);

module.exports = router;
