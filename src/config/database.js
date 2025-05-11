const config = require('./config');

module.exports = {
  development: {
    username: config.database.user,
    password: config.database.password,
    database: `${config.database.name}_dev`,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
  },
  test: {
    username: config.database.user,
    password: config.database.password,
    database: `${config.database.name}_test`,
    host: config.database.host,
    port: config.database.port,
    logging: false,
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    port: '5432',
    dialect: 'postgres',
  },
};
