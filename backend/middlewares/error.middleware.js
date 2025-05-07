const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

function normalizeError(err) {
  const normalizedError = { ...err };

  normalizedError.name = err.name;
  normalizedError.message = err.message;
  normalizedError.stack = err.stack;
  normalizedError.statusCode = err.statusCode || 500;
  normalizedError.status = err.status || "fail";

  return normalizedError;
}

// Handle mongoose Cast Errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle mongoose validation Errors to Business AppError
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle mongoose and MongoDB driver connections errors
const handleMongoConnectionError = (err) => {
  const message = "Cannot connect to the database. Please try again later.";
  return new AppError(message, 503);
};

// Handle jsonWebTokenError (thrown in jsonwebtoken.verify() method) for invalid format of token.
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// Transform TokenExpiredError (thrown in jsonwebtoken.verify() method) for expired token.
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // In production, We send a generic response for unhandled internal errors
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    logger.warn(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = normalizeError(err);

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    if (
      error.name === "MongooseServerSelectionError" ||
      error.name === "MongoNetworkError" ||
      error.name === "MongoTimeoutError"
    ) {
      error = handleMongoConnectionError(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    const logPayload = {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      route: req.originalUrl,
      method: req.method,
    };

    if (!error.isOperational) {
      logger.error(logPayload);
    } else {
      logger.warn(logPayload);
    }

    sendErrorProd(error, res);
  }
};

module.exports = errorController;
