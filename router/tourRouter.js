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
} = require('../controller/tourController');

const toursRouter = express.Router();

// param middleware
// toursRouter.param('id', idCheck);

toursRouter.get(
  '/top-5-cheap',
  (req, res, next) => {
    console.log('top-5-cheap route hit ✓');
    next();
  },
  aliasTopTours,
  getAllTours
);

toursRouter.route('/').get(getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = toursRouter;
