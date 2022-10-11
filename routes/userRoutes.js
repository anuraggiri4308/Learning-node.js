const express = require('express');
const userController = require('../controllers/userController');

//routes
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUser)
  .patch(userController.updateUsers);

module.exports = router;
