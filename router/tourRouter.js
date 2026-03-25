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
  getMonthlyPlan,
} = require('../controller/tourController');
const { protect } = require('../controller/authController');

const toursRouter = express.Router();

// param middleware
// toursRouter.param('id', idCheck);

toursRouter.get('/top-5-cheap', aliasTopTours, getAllTours);
toursRouter.get('/stats', getTourStats);
toursRouter.get('/monthly-plan/:year', getMonthlyPlan);

toursRouter.route('/').get(protect, getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = toursRouter;
