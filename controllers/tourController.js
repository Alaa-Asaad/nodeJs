/* eslint-disable arrow-body-style */
const Tour = require('../models/tourModel');
const ApiFeatures = require('../Utils/apiFeature');

//For Error handling or catch Error
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

//Tours Controllers

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute The Query  jonas use Tour.find() instead of just Tour both work fine
  const feature = new ApiFeatures(Tour, req.query)
    .filtter()
    .sort()
    .limitFields()
    .pagnate();
  const tours = await feature.query;

  //Send Response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(`There is no tour with ID ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.greateTour = catchAsync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);
  res.status(200).json({
    status: 'succes',
    data: {
      newtour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedtour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedtour) {
    return next(new AppError(`There is no tour with ID ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedtour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // { $match: { _id: { $ne: 'easy' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
//just for Referncese

// const fs = require('fs');

// const data = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`);
// let tours = JSON.parse(data);
