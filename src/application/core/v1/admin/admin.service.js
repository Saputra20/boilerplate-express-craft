const { Op } = require('sequelize');
const BaseService = require('../../../../@core/service/BaseService');
const { Admin, Sequelize } = require('../../../../database/models');

class AdminService extends BaseService {
  findByEmail(email, id = null) {
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

  findOneWithDetail(id) {
    return super.findOne({
      where: { id },
    });
  }
}

module.exports = new AdminService(Admin);
