const dayjs = require('dayjs');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: async () => {
    return {
      status: false,
      message: 'Too many requests, please try again later.',
    };
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  message: async () => {
    return {
      status: false,
      message: 'Too many requests, please try again later.',
    };
  },
});

const mailRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

const requestOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: async () => {
    return {
      status: false,
      message: 'Too many requests, please try again later.',
      data: {
        timestamps: dayjs().add('5', 'minutes').unix(),
      },
    };
  },
});

module.exports = {
  authLimiter,
  mailRequestLimiter,
  requestOtpLimiter,
  registerLimiter,
};
