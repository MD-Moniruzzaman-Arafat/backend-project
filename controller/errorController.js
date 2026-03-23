const AppError = require('../utils/appError');

// ─── Development ───────────────────────────────────────
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err, // ← পুরো error object
    stack: err.stack, // ← কোন file, কোন line এ error
  });
};

// ─── Production ────────────────────────────────────────
const sendErrorProd = (err, res) => {
  // আমাদের নিজের error — user কে দেখাও
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message, // ← শুধু message
    });

    // programming bug — user কে details দেখাবো না
  } else {
    console.error('ERROR:', err); // ← server এ log করো
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong', // ← generic message
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // err.path  = '_id'
  // err.value = 'wrongid'
  // message   = 'Invalid _id: wrongid'

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // err.errors এ সব validation error আছে
  console.log(err.errors);

  // সব error message বের করো
  const errors = Object.values(err.errors).map((el) => el.message);
  // ['A tour must have a name', '`hard` is not a valid enum value', ...]

  // একসাথে join করো
  const message = `Invalid input data. ${errors.join('. ')}`;
  // 'Invalid input data. A tour must have a name. `hard` is not a valid enum value'

  return new AppError(message, 400);
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    // CastError check করো
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    // duplicate field check
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // validation check
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
