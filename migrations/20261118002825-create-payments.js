'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: { //primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      billing_id: { 
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: 'billings',
          key: 'id'
        }
      },
      payment_proof:{
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('APPROVED', 'REJECTED', 'PENDING')
      },
      verified_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' //this works if an admin is deleted, the payment wouldnt be vanished
      },
      verified_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('payments');
  }
};