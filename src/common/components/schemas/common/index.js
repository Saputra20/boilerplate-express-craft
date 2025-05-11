const response = require('./response.schema');
const request = require('./request.schema');

module.exports = {
  ...response,
  ...request,
};
