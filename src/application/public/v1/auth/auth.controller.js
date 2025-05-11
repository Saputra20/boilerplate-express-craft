const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const ApiError = require('../../../../@core/interceptor/ApiError');
const tokenService = require('../../../../infrastructure/token/token.service');
const tokenBlacklistService = require('../../../../infrastructure/token/token-blacklist.service');
const authService = require('./auth.service');
const CONST = require('../../../../common/constants');
const mailQueue = require('../../../../infrastructure/queue/mail/mail.queue');
const config = require('../../../../config/config');
const userService = require('../user/user.service');
const security = require('../../../../common/helpers/security');

const { messages, mailer } = CONST;

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let account = await authService.login(email, password);
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email atau pasword tidak valid.');
  }
  const token = await tokenService.generatePairToken(
    { id: account.id, email: account.email, audience: CONST.token.ACCESS },
    CONST.jwt.ISSUER_PUBLIC,
    req,
  );
  account = account.toJSON();
  delete account.password;
  return new ApiResponse({
    messages: messages.AUTH.LOGIN_SUCCESS,
    data: {
      ...token,
      ...account,
    },
  }).send(res);
});

const register = catchAsync(async (req, res) => {
  const { body } = req;
  await authService.checkDuplicate(body);
  const verifyToken = tokenService.generateCode(6);
  const created = await authService.register({ ...body, verifyToken });
  const result = await tokenService.generateEmailVerifiedToken(
    {
      id: created.id,
      email: created.email,
      code: verifyToken,
    },
    CONST.jwt.ISSUER_PUBLIC,
  );
  await mailQueue.add({
    event: mailer.event.EMAIL_VERIFY,
    toAddress: created.email,
    templateData: {
      subject: 'Verify Email',
      link: `${config.baseUrl}/v1/auth/verify_email?token=${result.emailVerifyToken}`,
    },
  });
  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
  }).send(res);
});

const requestVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const account = await userService.findByEmail(email);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.AUTH.EMAIL_NOT_REGISTERED);
  const verifyToken = tokenService.generateCode(6);
  await account.update({ verifyToken });
  const result = await tokenService.generateEmailVerifiedToken(
    {
      id: account.id,
      email: account.email,
      code: verifyToken,
    },
    CONST.jwt.ISSUER_PUBLIC,
  );
  await mailQueue.add({
    event: mailer.event.EMAIL_VERIFY,
    toAddress: account.email,
    templateData: {
      subject: 'Verify Email',
      link: `${config.baseUrl}/v1/auth/verify_email?token=${result.emailVerifyToken}`,
    },
  });
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  const valid = await tokenService.validVerifyEmailToken(token, CONST.jwt.ISSUER_PUBLIC);
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  const tokenBlacklist = await tokenBlacklistService.find(token);
  if (tokenBlacklist) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_EXPIRED);
  const account = await userService.findById(valid.id);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  if (!security.compareHash(account.verifyToken, valid.hashedCode))
    throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  await account.update({ verifyToken: null, emailVerifiedAt: new Date() });
  const result = await tokenService.generatePairToken(
    { id: account.id, email: account.email, audience: CONST.token.ACCESS },
    CONST.jwt.ISSUER_PUBLIC,
    req,
  );
  await tokenBlacklistService.create(token);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const requestOTP = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const account = await userService.findByPhoneNumber(phoneNumber);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.AUTH.PHONE_NOT_REGISTERED);
  const phoneToken = tokenService.generateCode(6);
  await account.update({ phoneToken });
  const result = await tokenService.generateOtpToken(
    {
      id: account.id,
      email: account.email,
      otp: phoneToken,
    },
    CONST.jwt.ISSUER_PUBLIC,
  );
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const verifyOTP = catchAsync(async (req, res) => {
  const { token, otp } = req.body;
  const valid = await tokenService.validVerifyPhoneToken(token, CONST.jwt.ISSUER_PUBLIC);
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  const tokenBlacklist = await tokenBlacklistService.find(token);
  if (tokenBlacklist) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_EXPIRED);
  const account = await userService.findById(valid.id);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  if (otp === account.phoneToken && !security.compareHash(account.phoneToken, valid.hashedOtp))
    throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  await account.update({ phoneToken: null, phoneVerifiedAt: new Date() });
  const result = await tokenService.generatePairToken(
    { id: account.id, email: account.email, audience: CONST.token.ACCESS },
    CONST.jwt.ISSUER_PUBLIC,
    req,
  );
  await tokenBlacklistService.create(token);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const logout = catchAsync(async (req, res) => {
  const { account, token } = req;
  await tokenService.destroyMany({ where: { accountId: account.id, accessToken: token } });
  return new ApiResponse({
    messages: messages.AUTH.LOGOUT_SUCCESS,
    data: null,
  }).send(res);
});

const logoutAll = catchAsync(async (req, res) => {
  const { account } = req;
  await tokenService.destroyMany({ where: { accountId: account.id } });
  return new ApiResponse({
    messages: messages.AUTH.LOGOUT_SUCCESS,
    data: null,
  }).send(res);
});

const requestResetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const account = await userService.findByEmail(email);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.AUTH.EMAIL_NOT_REGISTERED);
  const resetToken = tokenService.generateCode(6);
  const result = await tokenService.generateResetPasswordToken({
    id: account.id,
    code: resetToken,
    email: account.email,
  });
  await mailQueue.add({
    event: mailer.event.RESET_PASSWORD,
    toAddress: account.email,
    templateData: {
      subject: 'Verify Email',
      link: `${config.baseAdminUrl}/reset_password?token=${result.resetPasswordToken}`,
    },
  });
  await account.update({ resetToken });
  return new ApiResponse({
    messages: messages.AUTH.FORGOT_PASSWORD_SUCCESS,
    data: null,
  }).send(res);
});

const resetPassword = catchAsync(async (req, res) => {
  const { resetPasswordToken, password } = req.body;
  const valid = await tokenService.validResetPasswordToken(
    resetPasswordToken,
    CONST.jwt.ISSUER_PUBLIC,
  );
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  const tokenBlacklist = await tokenBlacklistService.find(resetPasswordToken);
  if (tokenBlacklist) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_EXPIRED);
  const account = await userService.findById(valid.id);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  if (!security.compareHash(account.resetToken, valid.hashedCode))
    throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  await account.update({ resetToken: null, password });
  await tokenBlacklistService.create(resetPasswordToken);
  return new ApiResponse({
    messages: messages.AUTH.RESET_PASSWORD_SUCCESS,
    data: null,
  }).send(res);
});

module.exports = {
  login,
  logout,
  logoutAll,
  register,
  requestVerifyEmail,
  verifyEmail,
  requestOTP,
  verifyOTP,
  requestResetPassword,
  resetPassword,
};
