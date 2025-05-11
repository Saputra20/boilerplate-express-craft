const Joi = require('joi');
const { status } = require('../../../../common/constants');
const { password } = require('../../../../common/validation');

const createOrUpdate = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().allow(null, '').required(),
    email: Joi.string().trim().email().required().example('admin1@dispostable.com'),
    password: Joi.string()
      .trim()
      .required()
      .allow(null, '')
      .custom(password)
      .example('p@ssword123'),
    // confirmPassword: Joi.valid(Joi.ref('password')).required().example('p@ssword123'),
    roleId: Joi.number().required(),
    status: Joi.string()
      .valid(...Object.values(status))
      .default(status.ACTIVE),
  }),
};

module.exports = {
  createOrUpdate,
};
