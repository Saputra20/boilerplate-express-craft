const express = require('express');

// define route dependencies
const authRoute = require('../../../application/public/v1/auth/auth.route');
const meRoute = require('../../../application/public/v1/me/me.route');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/me',
    route: meRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
