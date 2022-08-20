const express = require('express');
const {
  getAllTours,
  greateTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictedTo } = require('../controllers/authController');

const tourRoute = express.Router();

// tourRoute.param('id', checkID);
tourRoute.route('/top-5-cheap').get(aliasTopTour, getAllTours);
tourRoute.route('/tour-stats').get(getTourStats);
tourRoute.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRoute.route('/').get(protect, getAllTours).post(greateTour);
tourRoute
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictedTo('admin', 'lead-guide'), deleteTour);

module.exports = tourRoute;
