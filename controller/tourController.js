// const fs = require('fs').promises;

const Tour = require('../model/tourModel');

// async function readMyFile() {
//   try {
//     const data = await fs.readFile(`${__dirname}/../data/data.json`, 'utf8');
//     return data;
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// middleware function
// exports.idCheck = async (req, res, next, val) => {
//   console.log(`param id is ${val}`);
//   next();
// };

// exports.checkBody = async (req, res, next) => {
//   console.log(`if check name and email is valid`);
//   next();
// };

// tours function
exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    // FILTERING
    const queryObj = { ...req.query };
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((el) => delete queryObj[el]);

    // ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) {
        throw new Error('This page does not  exist');
      }
    }

    // EXECUTE QUERY
    const tours = await query;
    // console.log(tours);
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND QUERY
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateTours = async (req, res) => {
  try {
    const tours = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteTours = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      requestAt: req.requestTime,
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createTours = async (req, res) => {
  try {
    const tours = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: ' fail',
      message: error.message,
    });
  }
};
