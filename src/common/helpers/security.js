const CONST = require('../constants');

/**
 * hash
 * @param {string} plaintext
 * @returns {string}
 */
const hash = (plaintext) => {
  return Bun.password.hashSync(plaintext, {
    algorithm: 'bcrypt',
    cost: CONST.jwt.PASSWORD_SALT_ROUND,
  });
};

/**
 * compare hash
 * @param {string} plaintext
 * @param {string} hashed
 * @returns {boolean}
 */
const compareHash = (plaintext, hashed) => {
  return Bun.password.verifySync(plaintext, hashed);
};

module.exports = {
  hash,
  compareHash,
};
