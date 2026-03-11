const express = require('express');
const {
  getAllTours,
  createTours,
  updateTours,
  deleteTours,
  getTours,
  idCheck,
  checkBody,
} = require('../controller/tourController');

const toursRouter = express.Router();

// param middleware
// toursRouter.param('id', idCheck);

toursRouter.route('/').get(getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = toursRouter;
