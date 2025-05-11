const Joi = require('joi');

const updateProfile = {
  body: Joi.object().keys({
    email: Joi.string().email().required().example('user@dispostable.com'),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().example('p@ssword123'),
    newPassword: Joi.string().required().example('p@ssword123'),
    confirmPassword: Joi.valid(Joi.ref('newPassword')).required().example('p@ssword123'),
  }),
};

module.exports = {
  updateProfile,
  changePassword,
};
