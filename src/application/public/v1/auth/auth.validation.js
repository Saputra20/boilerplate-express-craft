const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('user@dispostable.com'),
    password: Joi.string().required().example('p@ssword123'),
  }),
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('user@dispostable.com'),
    phoneNumber: Joi.string().required().example('0817777777777'),
    username: Joi.string().required().example('usertest'),
    password: Joi.string().required().example('p@ssword123'),
    confirmPassword: Joi.valid(Joi.ref('password')).required().example('p@ssword123'),
  }),
};

const requestVerifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('user@dispostable.com'),
  }),
};

const requestOTP = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

const verifyOTP = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

const requestResetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('user@dispostable.com'),
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
  register,
  requestVerifyEmail,
  requestOTP,
  verifyOTP,
  requestResetPassword,
  resetPassword,
};
