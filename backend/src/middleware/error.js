import logger from "../utils/logger.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode =
    err.statusCode ||
    (err.name === "ValidationError" ? 400 : 0) ||
    (err.name === "CastError" ? 400 : 500);
  const message =
    err.statusCode || err.name === "ValidationError" || err.name === "CastError"
      ? err.message
      : "Internal server error";

  logger.error(err.message, { stack: err.stack });

  res.status(statusCode).json({ success: false, message });
};

export { AppError, asyncHandler, errorHandler };
