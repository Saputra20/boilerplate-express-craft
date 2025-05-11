const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const ApiError = require('../../../../@core/interceptor/ApiError');
const tokenService = require('../../../../infrastructure/token/token.service');
const tokenBlacklistService = require('../../../../infrastructure/token/token-blacklist.service');
const mailQueue = require('../../../../infrastructure/queue/mail/mail.queue');
const authService = require('./auth.service');
const security = require('../../../../common/helpers/security');
const CONST = require('../../../../common/constants');
const config = require('../../../../config/config');

const { messages, mailer } = CONST;

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let account = await authService.login(email, password);
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.FAILED_LOGIN);
  }
  const token = await tokenService.generatePairToken(
    { id: account.id, email: account.email },
    CONST.jwt.ISSUER_CORE,
    req,
  );
  account = account.toJSON();
  delete account.password;
  return new ApiResponse({
    messages: messages.AUTH.LOGIN_SUCCESS,
    data: { ...token, ...account },
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

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const account = await authService.findAccountByEmail(email);
  if (!account) throw new ApiError(httpStatus.NOT_FOUND, messages.AUTH.EMAIL_NOT_REGISTERED);
  const resetToken = tokenService.generateCode(6);
  const result = await tokenService.generateResetPasswordToken(
    {
      id: account.id,
      code: resetToken,
      email: account.email,
    },
    CONST.jwt.ISSUER_CORE,
  );

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
    data: result,
  }).send(res);
});

const resetPassword = catchAsync(async (req, res) => {
  const { resetPasswordToken, password } = req.body;
  const valid = await tokenService.validResetPasswordToken(
    resetPasswordToken,
    CONST.jwt.ISSUER_CORE,
  );
  if (!valid) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_INVALID);
  const tokenBlacklist = await tokenBlacklistService.find(resetPasswordToken);
  if (tokenBlacklist) throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.URL_EXPIRED);
  const account = await authService.findAccountById(valid.id);
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
  forgotPassword,
  resetPassword,
};
