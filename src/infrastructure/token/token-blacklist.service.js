const redis = require('../../config/redis');

/**
 * create token
 * @param {string} token
 * @returns {string | null}
 */
const create = (token) => {
  const key = `token-blacklist:${token}`;
  const ret = redis.set(key, true);
  if (ret) {
    return token;
  }
  return null;
};

/**
 * find token
 * @param {string} token
 * @returns {string | null}
 */
const find = async (token) => {
  const key = `token-blacklist:${token}`;
  const ret = await redis.get(key);
  if (ret) {
    return token;
  }
  return null;
};

module.exports = {
  create,
  find,
};
