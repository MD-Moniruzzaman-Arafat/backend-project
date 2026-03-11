const fs = require('fs').promises;

async function readMyFile() {
  try {
    const data = await fs.readFile(`${__dirname}/../data/data.json`, 'utf8');
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

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
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};
