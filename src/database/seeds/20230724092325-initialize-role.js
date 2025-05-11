'use strict';
const { Role, Menu, RoleMenu } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const roleData = await Role.create({
      id: 1,
      name: 'Super Admin',
    });
    const modules = await Menu.findAll();

    const roleModules = [];
    for (let index = 0; index < modules.length; index++) {
      const moduleData = modules[index];
      roleModules.push({
        roleId: roleData.id,
        menuId: moduleData.id,
        permissions: moduleData.permissions,
      });
    }

    await RoleMenu.bulkCreate(roleModules);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
