  'use strict';

  /** @type {import('sequelize-cli').Migration} */
  module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('electricity_services', [
        {
          code: 900,
          name: 'R-1/TR 900 VA',
          power_va: 900,
          price_per_kwh: 1352,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 1300,
          name: 'R-1/TR 1300 VA',
          power_va: 1300,
          price_per_kwh: 1444,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 2200,
          name: 'R-1/TR 2200 VA',
          power_va: 2200,
          price_per_kwh: 1444,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('electricity_services', null, {});
    }
  };