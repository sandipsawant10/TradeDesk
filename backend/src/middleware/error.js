import logger from "../utils/logger.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal server error";

  logger.error(err.message, { stack: err.stack });

  res.status(statusCode).json({ success: false, message });
};

export { AppError, errorHandler };
