const { status: httpStatus } = require('http-status');
const CONST = require('../common/constants');
const ApiError = require('../@core/interceptor/ApiError');
const adminService = require('../application/core/v1/admin/admin.service');
const userService = require('../application/public/v1/user/user.service');
const roleService = require('../application/core/v1/role/role.service');
const tokenService = require('../infrastructure/token/token.service');
// eslint-disable-next-line no-unused-vars
const { IGuard } = require('../common/interface');

const { messages } = CONST;

/**
 *
 * @param {IGuard} guard
 * @returns
 */
const authCore = (guard = null) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer abc
    tokenService.verifyToken(
      token,
      CONST.token.ACCESS,
      CONST.jwt.ISSUER_CORE,
      async (err, payload) => {
        if (err) return next(new ApiError(httpStatus.UNAUTHORIZED, messages.COMMON.UNAUTHORIZED));
        if (payload.audience !== CONST.token.ACCESS)
          return next(new ApiError(httpStatus.BAD_REQUEST, messages.COMMON.BAD_TOKEN));
        if (!tokenService.findOne({ where: { accessToken: token } }))
          return next(new ApiError(httpStatus.BAD_REQUEST, messages.COMMON.BAD_TOKEN));
        const account = await adminService.findById(payload.id);
        if (!account) next(new ApiError(httpStatus.UNAUTHORIZED, messages.COMMON.UNAUTHORIZED));
        if (guard && !(await roleService.checkPermission(account.roleId, guard)))
          next(new ApiError(httpStatus.BAD_REQUEST, messages.COMMON.FORBIDDEN));
        req.account = account;
        req.token = token;
        next();
      },
    );
  };
};

const auth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer abc
    tokenService.verifyToken(
      token,
      CONST.token.ACCESS,
      CONST.jwt.ISSUER_PUBLIC,
      async (err, payload) => {
        if (err) return next(new ApiError(httpStatus.UNAUTHORIZED, messages.COMMON.UNAUTHORIZED));
        if (payload.audience !== CONST.token.ACCESS)
          return next(new ApiError(httpStatus.BAD_REQUEST, messages.COMMON.BAD_TOKEN));
        if (!tokenService.findOne({ where: { accessToken: token } }))
          return next(new ApiError(httpStatus.BAD_REQUEST, messages.COMMON.BAD_TOKEN));
        req.account = await userService.findById(payload.id);
        req.token = token;
        next();
      },
    );
  };
};

module.exports = {
  authCore,
  auth,
};
