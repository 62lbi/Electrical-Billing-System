'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [{
      name: 'Albi',
      email: 'albi@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Fixed: Use bulkDelete instead of bulkInsert to successfully roll back
    await queryInterface.bulkDelete('users', { email: 'albi@gmail.com' }, {});
  }
};