const bcrypt = require('bcryptjs');
const CONST = require('../constants');

/**
 * hash
 * @param {string} plaintext
 * @returns {string}
 */
const hash = (plaintext) => {
  return bcrypt.hashSync(plaintext, CONST.jwt.PASSWORD_SALT_ROUND);
};

/**
 * compare hash
 * @param {string} plaintext
 * @param {string} hashed
 * @returns {boolean}
 */
const compareHash = (plaintext, hashed) => {
  return bcrypt.compareSync(plaintext, hashed);
};

module.exports = {
  hash,
  compareHash,
};
