const swagger = require('../../../../../../common/helpers/swagger');
const authValidation = require('../../../../../../application/public/v1/auth/auth.validation');

const loginRequest = swagger.joiToSwagger(authValidation.login.body);
const registerRequest = swagger.joiToSwagger(authValidation.register.body);
const requestVerifyEmailRequest = swagger.joiToSwagger(authValidation.requestVerifyEmail.body);
const requestOTPRequest = swagger.joiToSwagger(authValidation.requestOTP.body);
const verifyOTPRequest = swagger.joiToSwagger(authValidation.verifyOTP.body);
const requestResetPasswordRequest = swagger.joiToSwagger(authValidation.requestResetPassword.body);
const resetPasswordRequest = swagger.joiToSwagger(authValidation.resetPassword.body);

module.exports = {
  loginRequest,
  registerRequest,
  requestVerifyEmailRequest,
  requestOTPRequest,
  verifyOTPRequest,
  requestResetPasswordRequest,
  resetPasswordRequest,
};
