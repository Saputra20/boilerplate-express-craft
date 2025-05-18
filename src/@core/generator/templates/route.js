const express = require('express');
const __Name__Controller = require('./__name__.controller');
const { authCore } = require('../../../../middleware/auth.middleware');
const validate = require('../../../../middleware/validation.middleware');
const __Name__Validation = require('./__name__.validation');
const queryParser = require('../../../../middleware/query-parser.middleware');
const querySerch = require('../../../../middleware/query-search.middleware');

const menuName = '__name__';

/**
 * @swagger
 * tags:
 *   name: __Name__
 *   description: __Name__
 */
const router = express.Router();

/**
 * @swagger
 * /core/v1/__name__s:
 *   post:
 *     summary: Create __Name__
 *     tags: [__Name__]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns __name__s data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdate__Name__Request'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdate__Name__Request'
 *     responses:
 *       '201':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/__name__CreatedResponse'
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
  validate(__Name__Validation.createOrUpdate),
  __Name__Controller.create,
);

/**
 * @swagger
 * /core/v1/__name__s:
 *   get:
 *     summary: List __Name__
 *     tags: [__Name__]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns __name__ data
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
 *                $ref: '#/components/schemas/__name__sResponse'
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
  __Name__Controller.list,
);

/**
 * @swagger
 * /core/v1/__name__s/{id}:
 *   get:
 *     summary: Get __Name__
 *     tags: [__Name__]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns __name__ data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/__name__Response'
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
router.get('/:id', authCore({ menu: menuName, permission: 'read' }), __Name__Controller.detail);

/**
 * @swagger
 * /core/v1/__name__s/{id}:
 *   put:
 *     summary: Update __Name__
 *     tags: [__Name__]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns __name__ data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdate__Name__Request'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdate__Name__Request'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/__name__UpdateResponse'
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
  validate(__Name__Validation.createOrUpdate),
  __Name__Controller.update,
);

/**
 * @swagger
 * /core/v1/__name__s/{id}:
 *   delete:
 *     summary: Delete __Name__
 *     tags: [__Name__]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns __name__ data
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/__name__DeleteResponse'
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
  __Name__Controller.destroy,
);

module.exports = router;
