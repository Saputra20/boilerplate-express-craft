const express = require('express');

// define route dependencies
const authRoute = require('../../../application/core/v1/auth/auth.route');
const adminRoute = require('../../../application/core/v1/admin/admin.route');
const roleRoute = require('../../../application/core/v1/role/role.route');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/admins',
    route: adminRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
