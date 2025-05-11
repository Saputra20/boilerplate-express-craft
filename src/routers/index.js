const express = require('express');
const config = require('../config/config');

// define route dependencies
const coreRoute = require('./core/router');
const publicRoute = require('./public/router');

// define development route dependencies
const docsRoute = require('../docs/docs.router');
const queueRoute = require('../infrastructure/queue/queue.route');

const router = express.Router();

const routes = [
  {
    path: '/',
    route: publicRoute,
  },
  {
    path: '/core',
    route: coreRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/queue-monitor',
    route: queueRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
