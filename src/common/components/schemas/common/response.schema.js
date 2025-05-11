const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../docs/index');
const CONST = require('../../../constants');
const { upload, validation } = require('./utils');

const {
  messages: { COMMON },
} = CONST;

const notFoundResponse = objectResponseSwagger(false, httpStatus.NOT_FOUND, COMMON.NOT_FOUND, null);
const forbiddenResponse = objectResponseSwagger(
  false,
  httpStatus.FORBIDDEN,
  COMMON.FORBIDDEN,
  null,
);
const unauthorizedResponse = objectResponseSwagger(
  false,
  httpStatus.FORBIDDEN,
  COMMON.UNAUTHORIZED,
  null,
);
const badRequestFormResponse = objectResponseSwagger(
  false,
  httpStatus.UNPROCESSABLE_ENTITY,
  COMMON.UNPROCESSABLE_ENTITY,
  validation,
);

const uploadResponse = objectResponseSwagger(false, httpStatus.OK, COMMON.OK, upload);

module.exports = {
  badRequestFormResponse,
  notFoundResponse,
  unauthorizedResponse,
  uploadResponse,
  forbiddenResponse,
};
