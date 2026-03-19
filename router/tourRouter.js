const express = require('express');
const {
  getAllTours,
  createTours,
  updateTours,
  deleteTours,
  getTours,
  idCheck,
  checkBody,
  aliasTopTours,
  getTourStats,
} = require('../controller/tourController');

const toursRouter = express.Router();

// param middleware
// toursRouter.param('id', idCheck);

toursRouter.get('/top-5-cheap', aliasTopTours, getAllTours);
toursRouter.get('/stats', getTourStats);

toursRouter.route('/').get(getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = toursRouter;
