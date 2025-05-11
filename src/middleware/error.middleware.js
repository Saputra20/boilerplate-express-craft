const { status: httpStatus } = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../@core/interceptor/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  let message = '';
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  if (!(error instanceof ApiError)) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const { path, value } = err.errors[0];
      statusCode = httpStatus.CONFLICT;
      message = `${path} ${value} already exists!`;
    } else {
      statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      message = error.message || httpStatus[statusCode];
    }
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { data } = err;
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    data,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
