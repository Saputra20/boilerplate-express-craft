const express = require('express');

// define route dependencies
const v1Router = require('./v1/router');

const router = express.Router();

const routes = [
  {
    path: '/v1',
    route: v1Router,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
