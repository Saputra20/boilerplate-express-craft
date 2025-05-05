const http = require('http');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = http.createServer(app);
server.listen(config.port);

server.on('error', (e) => {
  logger.error(e);
  process.exit(1);
});

server.on('listening', () => {
  logger.info(`listening on: ${config.port}`);
});
