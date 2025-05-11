const swagger = require('../../../../../../common/helpers/swagger');
const roleValidation = require('../../../../../../application/core/v1/role/role.validation');

const createOrUpdateRoleRequest = swagger.joiToSwagger(roleValidation.createOrUpdate.body);

module.exports = {
  createOrUpdateRoleRequest,
};
