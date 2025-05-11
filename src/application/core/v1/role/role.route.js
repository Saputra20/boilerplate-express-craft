const express = require('express');
const roleController = require('./role.controller');
const { authCore } = require('../../../../middleware/auth.middleware');
const validate = require('../../../../middleware/validation.middleware');
const queryParser = require('../../../../middleware/query-parser.middleware');
const querySearch = require('../../../../middleware/query-search.middleware');
const roleValidation = require('./role.validation');
const { getRole } = require('./role.middleware');

const menuName = 'role';

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role
 */
const router = express.Router();

/**
 * @swagger
 * /core/v1/roles:
 *   post:
 *     summary: Create Role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns role data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateRoleRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateRoleRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/roleCreatedResponse'
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
  validate(roleValidation.createOrUpdate),
  roleController.create,
);

/**
 * @swagger
 * /core/v1/roles:
 *   get:
 *     summary: List Role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns role data
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
 *                $ref: '#/components/schemas/rolesResponse'
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
  authCore({ menu: menuName, permission: 'read' }),
  queryParser,
  querySearch('name'),
  roleController.list,
);

/**
 * @swagger
 * /core/v1/roles/{id}:
 *   get:
 *     summary: Detail Role
 *     tags: [Role]
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns role data
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/roleResponse'
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
  getRole,
  roleController.detail,
);

/**
 * @swagger
 * /core/v1/roles/{id}:
 *   put:
 *     summary: Detail Role
 *     tags: [Role]
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     security:
 *       - bearerAuth: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateRoleRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateRoleRequest'
 *     description: Returns role data
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/roleUpdateResponse'
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
  validate(roleValidation.createOrUpdate),
  getRole,
  roleController.update,
);

/**
 * @swagger
 * /core/v1/roles/{id}:
 *   delete:
 *     summary: Delete Role
 *     tags: [Role]
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns role data
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/roleDeleteResponse'
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
  getRole,
  authCore({ menu: menuName, permission: 'delete' }),
  roleController.destroy,
);

module.exports = router;
