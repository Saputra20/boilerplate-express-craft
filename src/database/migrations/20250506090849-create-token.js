'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      account_id: {
        type: Sequelize.UUID,
      },
      access_token: {
        type: Sequelize.TEXT,
      },
      expired_in: {
        type: Sequelize.INTEGER,
      },
      refresh_token: {
        type: Sequelize.TEXT,
      },
      user_agent: {
        type: Sequelize.TEXT,
      },
      ip_address: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens');
  },
};
