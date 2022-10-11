const express = require('express');
const app = express();

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

//routes
const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).delete(deleteUser).patch(updateUsers);

module.exports = router;
