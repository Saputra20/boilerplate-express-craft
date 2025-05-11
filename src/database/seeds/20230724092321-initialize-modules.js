'use strict';
const { Menu } = require('../models');

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
    await Menu.bulkCreate([
      {
        id: 1,
        name: 'Admin',
        path: '/admin',
        icon: '',
        parent: null,
        permissions: ['create', 'read', 'update', 'delete'],
        slug: 'admin',
      },
      {
        id: 2,
        name: 'Role',
        path: '/role',
        icon: '',
        parent: null,
        permissions: ['create', 'read', 'update', 'delete'],
        slug: 'role',
      },
    ]);
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
