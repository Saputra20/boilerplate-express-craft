const authSchema = require('./auth');
const adminSchema = require('./admin');
const roleSchema = require('./role');

module.exports = {
  ...authSchema,
  ...adminSchema,
  ...roleSchema,
};
