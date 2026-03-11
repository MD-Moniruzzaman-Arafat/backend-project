const fs = require('fs').promises;
const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./router/userRouter');
const toursRouter = require('./router/tourRouter');
const app = express();

// middleware
app.use(express.json());

// custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3rd party middleware morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hi This Is My Project' });
});

module.exports = app;
