const fs = require('fs').promises;
const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./router/userRouter');
const toursRouter = require('./router/tourRouter');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./controller/errorController');
const app = express();

// config
app.set('query parser', function (str) {
  return require('qs').parse(str, { allowDots: true });
});

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

// handle unhandled route
app.all('*splat', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server okk`, 404));
});

// global error handler
app.use(globalErrorHandler);
module.exports = app;
