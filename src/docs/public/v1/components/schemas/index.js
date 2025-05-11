const authSchema = require('./auth');
const meSchema = require('./me');

module.exports = {
  ...authSchema,
  ...meSchema,
};
