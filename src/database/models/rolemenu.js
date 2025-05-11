'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoleMenu.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
      });
      RoleMenu.belongsTo(models.Menu, {
        foreignKey: 'menuId',
        targetKey: 'id',
        as: 'menu',
      });
    }
  }
  RoleMenu.init(
    {
      roleId: DataTypes.INTEGER,
      menuId: DataTypes.INTEGER,
      permissions: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'RoleMenu',
      tableName: 'role_menus',
      underscored: true,
    },
  );
  return RoleMenu;
};
