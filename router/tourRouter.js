const express = require('express');
const {
  getAllTours,
  createTours,
  updateTours,
  deleteTours,
  getTours,
} = require('../controller/tourController');

const toursRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = toursRouter;
