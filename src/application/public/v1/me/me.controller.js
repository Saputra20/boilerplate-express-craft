const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common/');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const CONST = require('../../../../common/constants');
const authService = require('../auth/auth.service');
const security = require('../../../../common/helpers/security');
const ApiError = require('../../../../@core/interceptor/ApiError');

const { messages } = CONST;

const me = catchAsync(async (req, res) => {
  const { account } = req;
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: account,
  }).send(res);
});

const updateProfile = catchAsync(async (req, res) => {
  const { body, account } = req;
  await authService.checkDuplicate(body, account.id);
  await account.update(body);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: account,
  }).send(res);
});

const changePassword = catchAsync(async (req, res) => {
  const { body, account } = req;
  const oldPassValid = security.compareHash(body.oldPassword, account.password);
  if (!oldPassValid)
    throw new ApiError(httpStatus.BAD_REQUEST, messages.ACCOUNT_SETTING.OLD_PASSWORD_INVALID);
  await account.update({ password: body.newPassword });
  return new ApiResponse({
    messages: messages.ACCOUNT_SETTING.CHANGE_PASSWORD_SUCCESS,
    data: account,
  }).send(res);
});

module.exports = {
  me,
  updateProfile,
  changePassword,
};
