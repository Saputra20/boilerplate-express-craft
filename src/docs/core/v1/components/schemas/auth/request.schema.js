const swagger = require('../../../../../../common/docs');
const authValidation = require('../../../../../../application/core/v1/auth/auth.validation');

const loginRequest = swagger.joiToSwagger(authValidation.login.body);
const forgotPasswordRequest = swagger.joiToSwagger(authValidation.forgotPassword.body);
const resetPasswordRequest = swagger.joiToSwagger(authValidation.resetPassword.body);

module.exports = {
  loginRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
};
