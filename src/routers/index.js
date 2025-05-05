const express = require('express');
const config = require('../config/config');

// define route dependencies
const coreRoute = require('./core/router');
const publicRoute = require('./public/router');

// define development route dependencies

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
