const swaggerJSDoc = require('swagger-jsdoc');
const { version } = require('../../../../package.json');
const config = require('../../../config/config');
const commonSchema = require('../../../common/components/schemas');
const commonParameters = require('../../../common/components/parameters');
const schema = require('./components/schemas');

// Swagger definition
const swaggerDefinitionCore = {
  openapi: '3.1.0',
  info: {
    title: 'Api Documentation For CMS',
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
  swaggerDefinition: swaggerDefinitionCore,
  apis: [
    `${__dirname}/../../../application/core/v1/*/*.route.js`,
    // `${__dirname}/../../../application/misc/*.route.js`,
  ],
};

module.exports = swaggerJSDoc(options);
