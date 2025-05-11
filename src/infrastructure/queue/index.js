const Queue = require('bull');
const config = require('../../config/config');

const redisOptions = {
  redis: {
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password,
  },
};

const createQueue = (name) => new Queue(`${config.queue.keyPrefix}.${name}`, redisOptions);

module.exports = {
  createQueue,
};
