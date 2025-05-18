const { status: httpStatus } = require('http-status');
const ApiError = require('../../../../@core/interceptor/ApiError');
const userService = require('../user/user.service');
const security = require('../../../../common/helpers/security');
const CONST = require('../../../../common/constants');

const {
  messages: { AUTH, COMMON },
} = CONST;

class AuthService {
  async login(emailOrUsername, password) {
    const account = await userService.findByEmailOrUsername(emailOrUsername);
    if (account) {
      if (account.password === '' || account.password == null) {
        throw new ApiError(httpStatus.BAD_REQUEST, AUTH.FAILED_LOGIN);
      }
      const passwordValid = account && security.compareHash(password, account.password);
      if (!account || !passwordValid) throw new ApiError(httpStatus.BAD_REQUEST, AUTH.FAILED_LOGIN);
      if (!account.emailVerifiedAt)
        throw new ApiError(httpStatus.BAD_REQUEST, AUTH.EMAIL_NOT_VERIFIED);
    }
    return account;
  }

  async checkDuplicate(body, id = null) {
    const { email, phoneNumber, username } = body;
    const [emailAlreadyExists, phoneAlreadyExists, usernameAlreadyExists] = await Promise.all([
      userService.findByEmail(email, id),
      userService.findByPhoneNumber(phoneNumber, id),
      userService.findByUsername(username, id),
    ]);

    if (emailAlreadyExists)
      throw new ApiError(httpStatus.CONFLICT, COMMON.CONFLICT.replace(':params', `Email ${email}`));
    if (phoneAlreadyExists)
      throw new ApiError(
        httpStatus.CONFLICT,
        COMMON.CONFLICT.replace(':params', `Phone Number ${phoneNumber}`),
      );
    if (usernameAlreadyExists)
      throw new ApiError(
        httpStatus.CONFLICT,
        COMMON.CONFLICT.replace(':params', `Username ${username}`),
      );
  }

  async register(body) {
    return userService.create(body);
  }
}

module.exports = new AuthService();
