const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

console.log('controller loaded ✓');

exports.aliasTopTours = (req, res, next) => {
  console.log('before:', req.query); // ← add করো

  req.query.limit = req.query.limit;
  req.query.sort = req.query.sort;
  req.query.fields = req.query.fields;

  console.log('after:', req.query); // ← add করো
  next();
};

// tours function
exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  // EXECUTE QUERY
  const tours = await features.query;

  // SEND QUERY
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.findById(req.params.id);

  if (!tours) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.updateTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!tours) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.deleteTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.findByIdAndDelete(req.params.id);

  if (!tours) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    requestAt: req.requestTime,
    data: null,
  });
});

exports.createTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'easy' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
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
        numTourStarts: { $sum: 1 },
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
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
