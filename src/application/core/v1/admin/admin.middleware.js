const { status: httpStatus } = require('http-status');
const ApiError = require('../../../../@core/interceptor/ApiError');
const { catchAsync } = require('../../../../@core/common');
const adminService = require('./admin.service');
const CONST = require('../../../../common/constants');

const {
  messages: { COMMON },
} = CONST;

const getAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await adminService.findOneWithDetail(id);
  if (!data) return next(new ApiError(httpStatus.NOT_FOUND, COMMON.NOT_FOUND));
  req.admin = data;
  next();
});

module.exports = {
  getAdmin,
};
