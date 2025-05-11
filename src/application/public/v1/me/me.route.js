const express = require('express');
const meController = require('./me.controller');
const { auth } = require('../../../../middleware/auth.middleware');
const validate = require('../../../../middleware/validation.middleware');
const meValidation = require('./me.validation');

/**
 * @swagger
 * tags:
 *   name: Me
 *   description: Me
 */
const router = express.Router();

/**
 * @swagger
 * /v1/me:
 *   get:
 *     summary: Get profile
 *     tags: [Me]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns account data
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/meResponse'
 */
router.get('/', auth(), meController.me);

/**
 * @swagger
 * /v1/me/update_profile:
 *   patch:
 *     summary: Update profile
 *     tags: [Me]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns account data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateProfileRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/meResponse'
 */
router.patch(
  '/update_profile',
  auth(),
  validate(meValidation.updateProfile),
  meController.updateProfile,
);

/**
 * @swagger
 * /v1/me/change_password:
 *   patch:
 *     summary: Update password
 *     tags: [Me]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns account data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/changePasswordRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/meResponse'
 */
router.patch(
  '/change_password',
  auth(),
  validate(meValidation.changePassword),
  meController.changePassword,
);

module.exports = router;
