const express = require('express');
const adminController = require('./admin.controller');
const { authCore } = require('../../../../middleware/auth.middleware');
const validate = require('../../../../middleware/validation.middleware');
const adminValidation = require('./admin.validation');
const { getAdmin } = require('./admin.middleware');
const queryParser = require('../../../../middleware/query-parser.middleware');
const querySerch = require('../../../../middleware/query-search.middleware');

const menuName = 'admin';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin
 */
const router = express.Router();

/**
 * @swagger
 * /core/v1/admins:
 *   post:
 *     summary: Create Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns admin data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateAdminRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateAdminRequest'
 *     responses:
 *       '201':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminCreatedResponse'
 *       '401':
 *         description: Unauthorize response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.post(
  '/',
  authCore({ menu: menuName, permission: 'create' }),
  validate(adminValidation.createOrUpdate),
  adminController.create,
);

/**
 * @swagger
 * /core/v1/admins:
 *   get:
 *     summary: List Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns admin data
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortBy'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminsResponse'
 *       '401':
 *         description: Unauthorize response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.get(
  '/',
  queryParser,
  querySerch('email', 'name', '$role.name$'),
  authCore({ menu: menuName, permission: 'read' }),
  adminController.list,
);

/**
 * @swagger
 * /core/v1/admins/{id}:
 *   get:
 *     summary: Get Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns admin data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminResponse'
 *       '401':
 *         description: Unauthorize response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.get(
  '/:id',
  authCore({ menu: menuName, permission: 'read' }),
  getAdmin,
  adminController.detail,
);

/**
 * @swagger
 * /core/v1/admins/{id}:
 *   put:
 *     summary: Update Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns admin data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateAdminRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateAdminRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminUpdateResponse'
 *       '401':
 *         description: Unauthorize response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.put(
  '/:id',
  authCore({ menu: menuName, permission: 'update' }),
  validate(adminValidation.createOrUpdate),
  getAdmin,
  adminController.update,
);

/**
 * @swagger
 * /core/v1/admins/{id}:
 *   delete:
 *     summary: Delete Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns admin data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/adminDeleteResponse'
 *       '401':
 *         description: Unauthorize response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.delete(
  '/:id',
  authCore({ menu: menuName, permission: 'delete' }),
  getAdmin,
  adminController.destroy,
);

module.exports = router;
