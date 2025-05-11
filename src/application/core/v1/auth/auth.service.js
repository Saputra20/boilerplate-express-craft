const { status: httpStatus } = require('http-status');
const ApiError = require('../../../../@core/interceptor/ApiError');
const adminService = require('../admin/admin.service');
const security = require('../../../../common/helpers/security');
const CONST = require('../../../../common/constants');

const { messages } = CONST;
class AuthService {
  async login(email, password) {
    const account = await adminService.findByEmail(email);

    if (account) {
      if (account.password === '' || account.password == null) {
        throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.FAILED_LOGIN);
      }
      const passwordValid = account && security.compareHash(password, account.password);
      if (!account || !passwordValid)
        throw new ApiError(httpStatus.BAD_REQUEST, messages.AUTH.FAILED_LOGIN);
    }
    return account;
  }

  findAccountByEmail(email) {
    return adminService.findByEmail(email);
  }

  findAccountById(id) {
    return adminService.findById(id);
  }
}

module.exports = new AuthService();
