const express = require('express');
const validate = require('../../../../middleware/validation.middleware');
const rateLimiter = require('../../../../middleware/rate-limiter.middleware');
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const { authCore } = require('../../../../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth
 */
const router = express.Router();

/**
 * @swagger
 * /core/v1/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/loginRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.post(
  '/login',
  rateLimiter.authLimiter,
  validate(authValidation.login),
  authController.login,
);

/**
 * @swagger
 * /core/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns message
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/logoutResponse'
 */
router.post('/logout', authCore(), authController.logout);

/**
 * @swagger
 * /core/v1/auth/logout_all:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns message
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/logoutResponse'
 */
router.post('/logout_all', authCore(), authController.logoutAll);

/**
 * @swagger
 * /core/v1/auth/forgot_password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/forgotPasswordRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/forgotPasswordRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.post(
  '/forgot_password',
  rateLimiter.authLimiter,
  validate(authValidation.forgotPassword),
  authController.forgotPassword,
);

/**
 * @swagger
 * /core/v1/auth/reset_password:
 *   post:
 *     summary: Reset Password
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resetPasswordRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/resetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.post(
  '/reset_password',
  rateLimiter.authLimiter,
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

module.exports = router;
