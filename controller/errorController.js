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

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
