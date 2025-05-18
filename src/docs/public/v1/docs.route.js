const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./spec.swagger');
const config = require('../../../config/config');

const router = express.Router();

router.use('/', swaggerUi.serveFiles(specs));
router.get(
  '/',
  swaggerUi.setup(specs, {
    customSiteTitle: config.name,
  }),
);

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

module.exports = router;
