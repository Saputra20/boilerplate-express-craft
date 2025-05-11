const Joi = require('joi');
const { status } = require('../../../../common/constants');

const createOrUpdate = {
  body: Joi.object().keys({
    name: Joi.string().required().example('p@ssword123'),
    modules: Joi.array()
      .items(
        Joi.object().keys({
          moduleId: Joi.number().required(),
          permissions: Joi.array().required(),
        }),
      )
      .required(),
    status: Joi.string()
      .valid(...Object.values(status))
      .default(status.ACTIVE),
  }),
};

module.exports = {
  createOrUpdate,
};
