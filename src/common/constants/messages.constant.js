module.exports = {
  COMMON: {
    IMPORT: 'Data imported successfully',
    OK: 'Data retrieved successfully',
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
    NOT_FOUND: 'Data not found',
    FORBIDDEN: 'Forbidden',
    UNAUTHORIZED: 'Unauthorized',
    BAD_TOKEN: 'Bad Token',
    UNPROCESSABLE_ENTITY: 'Validation Error',
    FILE_UPLOADED: 'File uploaded',
    PASSWORD_FORMAT_ERROR:
      'Password must be at least minimum 8 characters with combination uppercase, lowercase, number and symbol',
    CONFLICT: ':params already exists!',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Successful login',
    LOGOUT_SUCCESS: 'Successful logout',
    FAILED_LOGIN: 'Failed to login. Your email or password is invalid, please check again',
    EMAIL_NOT_VERIFIED: 'Failed to login. Your email has not been verified',
    ACCOUNT_INACTIVE: 'Failed to :param1. Your account is inactive, Please contact admin',
    EMAIL_NOT_REGISTERED: 'Failed to send your request, your email is not registered',
    PHONE_NOT_REGISTERED: 'Failed to send your request, your phone number is not registered',
    FORGOT_PASSWORD_SUCCESS:
      'Link reset password already resend to your email address, please check your email',
    URL_INVALID: 'URL expired. Please request a new link',
    URL_EXPIRED: 'URL already used. Please request a new link',
    RESET_PASSWORD_SUCCESS: 'New password created successfully. Please login',
  },
  ACCOUNT_SETTING: {
    CHANGE_PASSWORD_SUCCESS: 'Password updated successfully',
    OLD_PASSWORD_INVALID: 'Current password is invalid',
  },
};
