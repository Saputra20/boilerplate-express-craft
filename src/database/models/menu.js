'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menu.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      path: DataTypes.STRING,
      icon: DataTypes.STRING,
      parent: DataTypes.INTEGER,
      permissions: DataTypes.JSON,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Menu',
      tableName: 'menus',
      underscored: true,
    },
  );
  return Menu;
};
