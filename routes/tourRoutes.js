const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkId);

//create a checkbody middleware

//check if body contains the name and price property

//if not send back 400 (bad request)

//add it to post handler stack

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); //chained checkbody so first checkbody middleware will run and then after createTour will run
router
  .route('/:id')
  .get(tourController.getTourById)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTours);

module.exports = router;
