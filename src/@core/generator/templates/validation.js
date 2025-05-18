const Joi = require('joi');

const createOrUpdate = {
  body: Joi.object().keys({ __joi_fields__ }),
};

module.exports = {
  createOrUpdate,
};
