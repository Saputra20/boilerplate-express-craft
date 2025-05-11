const swagger = require('../../../../../../common/helpers/swagger');
const meValidation = require('../../../../../../application/public/v1/me/me.validation');

const updateProfileRequest = swagger.joiToSwagger(meValidation.updateProfile.body);
const changePasswordRequest = swagger.joiToSwagger(meValidation.changePassword.body);

module.exports = {
  updateProfileRequest,
  changePasswordRequest,
};
