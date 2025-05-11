const swaggerJSDoc = require('swagger-jsdoc');
const { version } = require('../../../../package.json');
const config = require('../../../config/config');
const commonSchema = require('../../../common/components/schemas');
const commonParameters = require('../../../common/components/parameters');
const schema = require('./components/schemas');

// Swagger definition
const swaggerDefinitionPublic = {
  openapi: '3.1.0',
  info: {
    title: 'Api Documentation For Public',
    version,
    description: '#',
  },
  servers: [
    {
      url: config.baseUrl,
    },
  ],
  components: {
    schemas: {
      ...commonSchema,
      ...schema,
    },
    parameters: {
      ...commonParameters,
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        name: 'auth',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
};

const options = {
  swaggerDefinition: swaggerDefinitionPublic,
  apis: [
    `${__dirname}/../../../application/public/v1/*/*.route.js`,
    `${__dirname}/../../../application/misc/*.route.js`,
  ],
};

module.exports = swaggerJSDoc(options);
