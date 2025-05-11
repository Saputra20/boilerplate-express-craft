const j2s = require('joi-to-swagger');

/**
 * convert joi to swagger
 * @param {object} schema
 * @returns {object}
 */
const joiToSwagger = (schema) => {
  const result = j2s(schema).swagger;
  delete result.additionalProperties;
  return result;
};

/**
 *
 * @param {Boolean} success
 * @param {Number} code
 * @param {String} message
 * @param {Any} data
 * @returns
 */
const objectResponseSwagger = (success, code, message, data) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: success,
      },
      code: {
        type: 'integer',
        example: code,
      },
      message: {
        type: 'string',
        example: message,
      },
      data: {
        type: 'object',
        example: data,
      },
    },
  };
};

module.exports = {
  joiToSwagger,
  objectResponseSwagger,
};
