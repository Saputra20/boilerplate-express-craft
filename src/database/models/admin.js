'use strict';
const { Model } = require('sequelize');
const security = require('../../common/helpers/security');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.belongsTo(models.Role, {
        foreignKey: 'roleId',
        targetKey: 'id',
        as: 'role',
      });
    }
  }
  Admin.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(value) {
          if (value) {
            const hashedPassword = security.hash(value);
            this.setDataValue('password', hashedPassword);
          }
        },
      },
      roleId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Admin',
      tableName: 'admins',
      underscored: true,
    },
  );
  return Admin;
};
