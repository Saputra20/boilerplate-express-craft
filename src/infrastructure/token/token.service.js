/* eslint-disable no-unused-vars */

const fs = require('fs');
const path = require('path');
const { status: httpStatus } = require('http-status');
const { hash } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const ApiError = require('../../@core/interceptor/ApiError');
const config = require('../../config/config');
const CONST = require('../../common/constants');
const {
  IPayload,
  IToken: { tokenOptions },
} = require('../../common/interface');
const { Token } = require('../../database/models');
const BaseService = require('../../@core/service/BaseService');

class TokenService extends BaseService {
  /**
   * getKeyFile
   * @param {string} filename
   * @returns {Buffer}
   */
  getKeyFile(filename) {
    const filePath = `${path.join(__dirname, '../../config/secret')}/${filename}`;

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!fs.existsSync(filePath)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'file secret not found');
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return fs.readFileSync(filePath);
  }

  /**
   * sessionPayload
   * @param {string} audience
   * @param {IPayload} payload
   * @returns {string}
   */
  sessionPayload(audience, payload) {
    const { id, email } = payload;
    const { appName } = config;
    return `${appName}:${audience}:${id}:${email}`;
  }

  /**
   * verifyToken
   * @param {string} token
   * @param {string} audience
   * @param {string} issuer
   * @param {jwt.VerifyCallback} callback
   * @returns {void}
   */
  verifyToken(_token, audience, issuer = CONST.jwt.ISSUER_PUBLIC, callback) {
    const { ALGORITHM, PUBLIC_FILE } = CONST.secret;
    const secret = this.getKeyFile(PUBLIC_FILE);
    return jwt.verify(
      _token,
      secret,
      {
        algorithms: ALGORITHM,
        audience: this.encrypt(audience),
        issuer,
        ignoreExpiration: false,
      },
      callback,
    );
  }

  /**
   * takePayload
   * @param {string} token
   * @param {string} audience
   * @param {string} issuer
   * @returns {void}
   */
  takePayload(_token, audience, issuer) {
    return this.verifyToken(_token, audience, issuer, (err, payload) => {
      if (err) return null;
      return payload;
    });
  }

  /**
   * singToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @param {string} expiresIn
   * @returns {string}
   */
  async signToken(payload, issuer, expiresIn = config.jwt.accessExpiration) {
    const { ALGORITHM, SECRET_FILE } = CONST.secret;
    const secret = this.getKeyFile(SECRET_FILE);
    const payloadJSON = JSON.parse(JSON.stringify(payload));
    const sessionPayload = this.sessionPayload(payload.audience, payload);
    const sid = await hash(sessionPayload, CONST.jwt.PASSWORD_SALT_ROUND);

    return jwt.sign({ ...payloadJSON, sid }, secret, {
      algorithm: ALGORITHM,
      audience: this.encrypt(payload.audience),
      expiresIn,
      issuer,
    });
  }

  /**
   * encrypt
   * @param {string} text
   * @returns {string}
   */
  encrypt(text) {
    try {
      const key = crypto.scryptSync(
        CONST.jwt.PAYLOAD_PASSWORD,
        CONST.jwt.PAYLOAD_SALT,
        CONST.jwt.PAYLOAD_SALT_ROUND,
      );

      // eslint-disable-next-line no-undef
      const iv = Buffer.alloc(16, 0); // Initialization vector.
      const cipher = crypto.createCipheriv(CONST.jwt.PAYLOAD_ALGORITHM, key, iv);

      return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } catch (e) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
    }
  }

  /**
   * encryptData
   * @param {string} string
   * @returns {string}
   */
  encryptData(string) {
    return CryptoJS.AES.encrypt(string, CONST.secret.SECRET_FILE).toString();
  }

  /**
   * decryptData
   * @param {string} string
   * @returns {string}
   */
  decryptData(string) {
    return CryptoJS.AES.decrypt(string, CONST.secret.SECRET_FILE).toString(CryptoJS.enc.Utf8);
  }

  /**
   * generateAccessToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {string}
   */
  async generateAccessToken(payload, issuer = CONST.jwt.ISSUER_PUBLIC) {
    return this.signToken(
      { ...payload, audience: CONST.token.ACCESS },
      issuer,
      config.jwt.accessExpiration,
    );
  }

  /**
   * generateRefreshToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {string}
   */
  async generateRefreshToken(payload, issuer = CONST.jwt.ISSUER_PUBLIC) {
    return this.signToken(
      { ...payload, audience: CONST.token.REFRESH },
      issuer,
      config.jwt.refreshExpiration,
    );
  }

  /**
   * generateOtpToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {object}
   */
  async generateOtpToken(payload, issuer = CONST.jwt.ISSUER_PUBLIC) {
    const hashedOtp = await hash(payload.otp, CONST.jwt.PASSWORD_SALT_ROUND);
    const audience = CONST.token.OTP;
    const _token = await this.signToken(
      { hashedOtp, email: payload.email, id: payload.id, audience },
      issuer,
      '2m',
    );
    const payloadInfo = this.takePayload(_token, audience);
    return {
      otpToken: _token,
      exp: payloadInfo.exp,
    };
  }

  /**
   * generateValidOtpToken
   * @param {string} otpToken
   * @returns {object}
   */
  generateValidOtpToken(otpToken) {
    return this.verifyToken(otpToken, CONST.token.OTP, (err, payload) => {
      if (err) return null;
      return {
        email: payload.email,
        token: this.signToken({ email: payload.email }, CONST.token.VALID_OTP, '2m'),
      };
    });
  }

  /**
   * generateResetPasswordToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {string}
   */
  async generateResetPasswordToken(payload, issuer = CONST.jwt.ISSUER_PUBLIC) {
    const hashedCode = await hash(payload.code, CONST.jwt.PASSWORD_SALT_ROUND);
    const audience = CONST.token.RESET_PASSWORD;
    const _token = await this.signToken(
      { email: payload.email, id: payload.id, audience, hashedCode },
      issuer,
      '1h',
    );

    const payloadInfo = this.takePayload(_token, audience, issuer);
    return {
      resetPasswordToken: _token,
      exp: payloadInfo.exp,
    };
  }

  /**
   * generatePairToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {object}
   */
  async generatePairToken(payload, issuer, req) {
    const accessToken = await this.generateAccessToken(payload, issuer);
    const refreshToken = await this.generateRefreshToken(payload, issuer);
    await this.createOrUpdate({
      accountId: payload.id,
      accessToken,
      refreshToken,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * refreshAccessToken
   * @param {string} refreshToken
   * @param {string} issuer
   * @returns {object}
   */
  refreshAccessToken(refreshToken, issuer) {
    return this.verifyToken(refreshToken, CONST.token.REFRESH, issuer, (err, payload) => {
      if (err || payload.audience !== CONST.token.REFRESH) return null;
      delete payload.iat;
      delete payload.exp;
      return { ...this.generatePairToken(payload, issuer) };
    });
  }

  /**
   *
   * @param {tokenOptions} body
   * @returns
   */
  async createOrUpdate(body) {
    const data = await this.findOne({
      where: { accountId: body.accountId, userAgent: body.userAgent },
    });
    if (data) {
      return data.update(body);
    }
    return super.create(body);
  }

  /**
   * genereate code
   * @param {Number} n
   * @returns {Number}
   */
  generateCode(n) {
    return Math.random().toFixed(n).split('.')[1];
  }

  /**
   * generateEmailVerifiedToken
   * @param {IPayload} payload
   * @param {string} issuer
   * @returns {object}
   */
  async generateEmailVerifiedToken(payload, issuer = CONST.jwt.ISSUER_PUBLIC) {
    const hashedCode = await hash(payload.code, CONST.jwt.PASSWORD_SALT_ROUND);
    const audience = CONST.token.VERIFY_EMAIL;
    const _token = await this.signToken(
      { hashedCode, email: payload.email, id: payload.id, audience },
      issuer,
      '1h',
    );
    const payloadInfo = this.takePayload(_token, audience, issuer);
    return {
      emailVerifyToken: _token,
      exp: payloadInfo.exp,
    };
  }

  /**
   * validVerifyEmailToken
   * @param {string} _token
   * @param {string} issuer
   * @returns {any}
   */
  validVerifyEmailToken(_token, issuer) {
    return this.verifyToken(_token, CONST.token.VERIFY_EMAIL, issuer, (err, payload) => {
      if (err) return null;
      return payload;
    });
  }

  /**
   * validVerifyPhoneToken
   * @param {string} _token
   * @param {string} issuer
   * @returns {any}
   */
  validVerifyPhoneToken(_token, issuer) {
    return this.verifyToken(_token, CONST.token.OTP, issuer, (err, payload) => {
      if (err) return null;
      return payload;
    });
  }

  /**
   * validVerifyPhoneToken
   * @param {string} _token
   * @param {string} issuer
   * @returns {any}
   */
  validResetPasswordToken(_token, issuer) {
    return this.verifyToken(_token, CONST.token.RESET_PASSWORD, issuer, (err, payload) => {
      if (err) return null;
      return payload;
    });
  }
}

module.exports = new TokenService(Token);
