const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/helpers/swagger');
const { listPagination } = require('../../../../../../common/components/data');
const CONST = require('../../../../../../common/constants');
const { roleCreated, roleData, roleDetailData } = require('./utils');

const { messages } = CONST;

const roleCreatedResponse = objectResponseSwagger(
  true,
  httpStatus.CREATED,
  messages.COMMON.CREATED,
  roleCreated,
);
const rolesResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  listPagination(roleData),
);
const roleResponse = objectResponseSwagger(true, httpStatus.OK, messages.COMMON.OK, roleData);
const roleUpdateResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.UPDATED,
  roleDetailData,
);
const roleDeleteResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.DELETED,
  roleDetailData,
);

module.exports = {
  roleCreatedResponse,
  rolesResponse,
  roleResponse,
  roleUpdateResponse,
  roleDeleteResponse,
};
