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
    const tours = await Tour.find();
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
