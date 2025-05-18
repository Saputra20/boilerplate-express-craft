const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/helpers/swagger');
const CONST = require('../../../../../../common/constants');

const { messages } = CONST;
const { loginData, requestVerifyEmail, requestOTP, requestResetPassword } = require('./utils');

const loginResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.AUTH.LOGIN_SUCCESS,
  loginData,
);

const logoutResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.AUTH.LOGOUT_SUCCESS,
  null,
);

const requestVerifyEmailResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  requestVerifyEmail,
);

const requestOTPResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  requestOTP,
);

const requestResetPasswordResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.AUTH.FORGOT_PASSWORD_SUCCESS,
  requestResetPassword,
);

const resetPasswordResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.AUTH.RESET_PASSWORD_SUCCESS,
  null,
);

module.exports = {
  loginResponse,
  logoutResponse,
  requestVerifyEmailResponse,
  requestOTPResponse,
  requestResetPasswordResponse,
  resetPasswordResponse,
};
