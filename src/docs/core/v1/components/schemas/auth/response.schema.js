const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/docs');
const CONST = require('../../../../../../common/constants');

const { messages } = CONST;
const { loginData } = require('./utils');

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

module.exports = {
  loginResponse,
  logoutResponse,
};
