const request = require('./request.schema');
const response = require('./response.schema');

module.exports = {
  ...request,
  ...response,
};
