const express = require('express');

// define route dependencies
const coreRoute = require('./core/docs.route');
const publicRoute = require('./public/docs.route');

const router = express.Router();

const routes = [
  {
    path: '/core',
    route: coreRoute,
  },
  {
    path: '/public',
    route: publicRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
