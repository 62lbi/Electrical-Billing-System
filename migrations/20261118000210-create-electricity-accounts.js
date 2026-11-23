'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('electricity_accounts', {
      id: { //primary key for table electricity_accounts
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: { //foreign key, using the primary key from users.js migration
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
      },
      electricity_service_id: { //foreign key, using the primary key from electricity-services
        type: Sequelize.INTEGER,
        references: {
          model: 'electricity_services',
          key: 'id',
        },
      },
      customer_number: { //added unique constraint for customer_number
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ACTIVE','UNACTIVE'), //is this correct?
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('electricity_accounts');
  }
};