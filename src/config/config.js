const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    // APP
    APP_NAME: Joi.string().required(),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    BASE_URL: Joi.string().required(),
    BASE_ADMIN_URL: Joi.string().required(),
    // QUEUE
    QUEUE_KEY_PREFIX: Joi.string().required(),
    QUEUE_USERNAME: Joi.string().required(),
    QUEUE_PASSWORD: Joi.string().required(),
    // DATABASE
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().default(''),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_NAME: Joi.string().required(),
    // MAILER
    MAIL_HOST: Joi.string().required(),
    MAIL_PORT: Joi.number().required(),
    MAIL_USERNAME: Joi.string().required(),
    MAIL_PASSWORD: Joi.string().required(),
    MAIL_FROM_HEADER: Joi.string().required(),
    // REDIS
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow('', null).default(''),
    // JWT
    JWT_ACCESS_EXPIRATION: Joi.string().default('2d').description('access tokens expire'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('4d').description('refresh tokens expire'),
    // S3
    SPACE_NAME: Joi.string().required(),
    SPACE_KEY: Joi.string().required(),
    SPACE_SECRET: Joi.string().required(),
    SPACE_ENDPOINT: Joi.string().required(),
    SPACE_ROOT_DIR: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  name: envVars.APP_NAME,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
  baseAdminUrl: envVars.BASE_ADMIN_URL,
  queue: {
    keyPrefix: envVars.QUEUE_KEY_PREFIX,
    username: envVars.QUEUE_USERNAME,
    password: envVars.QUEUE_PASSWORD,
  },
  database: {
    user: envVars.DATABASE_USER,
    password: envVars.DATABASE_PASSWORD,
    host: envVars.DATABASE_HOST,
    port: envVars.DATABASE_PORT,
    name: envVars.DATABASE_NAME,
  },
  mail: {
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    username: envVars.MAIL_USERNAME,
    password: envVars.MAIL_PASSWORD,
    fromHeader: envVars.MAIL_FROM_HEADER,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
  },
  jwt: {
    accessExpiration: envVars.JWT_ACCESS_EXPIRATION,
    refreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
  },
  s3: {
    name: envVars.SPACE_NAME,
    key: envVars.SPACE_KEY,
    secret: envVars.SPACE_SECRET,
    endpoint: envVars.SPACE_ENDPOINT,
    rootDir: envVars.SPACE_ROOT_DIR,
  },
};
