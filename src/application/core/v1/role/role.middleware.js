const { status: httpStatus } = require('http-status');
const ApiError = require('../../../../@core/interceptor/ApiError');
const { catchAsync } = require('../../../../@core/common');
const roleService = require('./role.service');
const CONST = require('../../../../common/constants');

const {
  messages: { COMMON },
} = CONST;

const getRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await roleService.findOneWithDetail(id);
  if (!data) return next(new ApiError(httpStatus.NOT_FOUND, COMMON.NOT_FOUND));
  req.role = data;
  next();
});

module.exports = {
  getRole,
};
