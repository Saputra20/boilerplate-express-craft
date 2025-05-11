const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('admin@dispostable.com'),
    password: Joi.string().required().example('p@ssword123'),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('admin@dispostable.com'),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    resetPasswordToken: Joi.string().required(),
    password: Joi.string().required().example('p@ssword123'),
    confirmPassword: Joi.valid(Joi.ref('password')).required().example('p@ssword123'),
  }),
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
