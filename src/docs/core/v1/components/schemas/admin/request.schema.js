const swagger = require('../../../../../../common/helpers/swagger');
const adminValidation = require('../../../../../../application/core/v1/admin/admin.validation');

const createOrUpdateAdminRequest = swagger.joiToSwagger(adminValidation.createOrUpdate.body);

module.exports = {
  createOrUpdateAdminRequest,
};
