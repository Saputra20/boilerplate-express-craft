const express = require('express');
const validate = require('../../../../middleware/validation.middleware');
const rateLimiter = require('../../../../middleware/rate-limiter.middleware');
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const { auth } = require('../../../../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth
 */
const router = express.Router();

/**
 * @swagger
 * /v1/auth/login:
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
 * /v1/auth/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/requestVerifyEmailResponse'
 */
router.post(
  '/register',
  rateLimiter.registerLimiter,
  validate(authValidation.register),
  authController.register,
);

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     description: Returns credential account
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.post('/logout', auth(), authController.login);

/**
 * @swagger
 * /v1/auth/logout_all:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     description: Returns credential account
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/logoutResponse'
 */
router.post('/logout_all', auth(), authController.logoutAll);

/**
 * @swagger
 * /v1/auth/request_verify_email:
 *   post:
 *     summary: Request Verify Email
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/requestVerifyEmailRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/requestVerifyEmailResponse'
 */
router.post(
  '/request_verify_email',
  validate(authValidation.requestVerifyEmail),
  authController.requestVerifyEmail,
);

/**
 * @swagger
 * /v1/auth/verify_email:
 *   get:
 *     summary: Verify Email
 *     tags: [Auth]
 *     description: Returns credential account
 *     parameters:
 *       - $ref: '#/components/parameters/token'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.get('/verify_email', authController.verifyEmail);

/**
 * @swagger
 * /v1/auth/request_otp:
 *   post:
 *     summary: Request OTP
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/requestOTPRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/requestOTPResponse'
 */
router.post('/request_otp', validate(authValidation.requestOTP), authController.requestOTP);

/**
 * @swagger
 * /v1/auth/verify_otp:
 *   post:
 *     summary: Request Verify OTP
 *     tags: [Auth]
 *     description: Returns credential account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/verifyOTPRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/loginResponse'
 */
router.post('/verify_otp', validate(authValidation.verifyOTP), authController.verifyOTP);

/**
 * @swagger
 * /v1/auth/request_reset_password:
 *   post:
 *     summary: Request Reset Password
 *     tags: [Auth]
 *     description: Returns credential token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/requestResetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/requestResetPasswordResponse'
 */
router.post(
  '/request_reset_password',
  validate(authValidation.requestResetPassword),
  authController.requestResetPassword,
);

/**
 * @swagger
 * /v1/auth/reset_password:
 *   put:
 *     summary: Reset Password
 *     tags: [Auth]
 *     description: Returns credential token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/resetPasswordResponse'
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
 */
router.put('/reset_password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
