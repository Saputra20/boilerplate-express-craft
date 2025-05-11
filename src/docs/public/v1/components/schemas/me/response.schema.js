const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/helpers/swagger');
const CONST = require('../../../../../../common/constants');
const { meData } = require('./utils');

const { messages } = CONST;

const meResponse = objectResponseSwagger(true, httpStatus.OK, messages.COMMON.OK, meData);

module.exports = {
  meResponse,
};
