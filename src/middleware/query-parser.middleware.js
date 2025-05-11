const { status: httpStatus } = require('http-status');
const ApiError = require('../@core/interceptor/ApiError');
const { queryParser: qp } = require('../@core/common');

const queryParser = (req, res, next) => {
  try {
    const query = Object.assign({}, req.query);
    const { page = 1, limit = 10 } = query;
    Object.defineProperty(req, 'query', {
      ...Object.getOwnPropertyDescriptor(req, 'query'),
      value: qp(req.query),
      writable: true,
    });
    req.query.offset = (page - 1) * limit;
    req.query.limit = Number(limit) || 10;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid Query'));
  }
};

module.exports = queryParser;
