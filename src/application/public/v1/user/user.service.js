const { Op } = require('sequelize');
const BaseService = require('../../../../@core/service/BaseService');
const { User, Sequelize } = require('../../../../database/models');

class UserService extends BaseService {
  findByEmailOrUsername(emailUsername) {
    return super.findOne({
      where: {
        [Op.or]: [
          {
            email: emailUsername,
          },
          {
            username: emailUsername,
          },
        ],
      },
    });
  }

  findByEmail(email, id) {
    return super.findOne({
      where: {
        [Op.and]: [
          {
            email,
          },
          ...(id ? [Sequelize.where(Sequelize.col('id'), '<>', id)] : []),
        ],
      },
    });
  }

  findByUsername(username, id) {
    return super.findOne({
      where: {
        [Op.and]: [
          {
            username,
          },
          ...(id ? [Sequelize.where(Sequelize.col('id'), '<>', id)] : []),
        ],
      },
    });
  }

  findByPhoneNumber(phoneNumber, id) {
    return super.findOne({
      where: {
        [Op.and]: [
          {
            phoneNumber,
          },
          ...(id ? [Sequelize.where(Sequelize.col('id'), '<>', id)] : []),
        ],
      },
    });
  }
}

module.exports = new UserService(User);
