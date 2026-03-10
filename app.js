const fs = require('fs').promises;
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

// middleware
app.use(express.json());

// custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3rd party middleware morgan
app.use(morgan('dev'));

async function readMyFile() {
  try {
    const data = await fs.readFile(`${__dirname}/data/data.json`, 'utf8');
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

// tours function
const getAllTours = async (req, res) => {
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

const getTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const updateTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const deleteTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const createTours = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

// users function
const getAllUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const getUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const updateUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const deleteUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const createUsers = async (req, res) => {
  res.status(500).json({
    status: ' error',
    message: ' this route is not define',
  });
};

const toursRouter = express.Router();
const usersRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createTours);
toursRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

usersRouter.route('/').get(getAllUsers).post(createUsers);
usersRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hi This Is My Project' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
