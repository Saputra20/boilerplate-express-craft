const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/helpers/swagger');
const { listPagination } = require('../../../../../../common/components/data');
const CONST = require('../../../../../../common/constants');
const { adminCreated } = require('./utils');

const { messages } = CONST;

const adminCreatedResponse = objectResponseSwagger(
  true,
  httpStatus.CREATED,
  messages.COMMON.CREATED,
  adminCreated,
);
const adminsResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  listPagination(adminCreated),
);
const adminResponse = objectResponseSwagger(true, httpStatus.OK, messages.COMMON.OK, adminCreated);
const adminUpdateResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.UPDATED,
  adminCreated,
);
const adminDeleteResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.DELETED,
  adminCreated,
);

module.exports = {
  adminCreatedResponse,
  adminsResponse,
  adminResponse,
  adminUpdateResponse,
  adminDeleteResponse,
};
