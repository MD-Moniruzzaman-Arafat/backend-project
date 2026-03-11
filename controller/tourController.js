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
  const result = await readMyFile();
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: JSON.parse(result).length,
    data: {
      tours: JSON.parse(result),
    },
  });
};

exports.getTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

exports.updateTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

exports.deleteTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
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
