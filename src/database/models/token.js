'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      accountId: DataTypes.UUID,
      accessToken: DataTypes.TEXT,
      expiredIn: DataTypes.INTEGER,
      refreshToken: DataTypes.TEXT,
      userAgent: DataTypes.TEXT,
      ipAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Token',
      tableName: 'tokens',
      underscored: true,
    },
  );
  return Token;
};
