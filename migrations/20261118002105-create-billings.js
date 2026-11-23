'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('billings', {
      id: { //primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      electricity_account_id: { //foreign key, using the primary key of electricity-accounts and added unique constraint
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'electricity_accounts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      period_month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      period_year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      previous_meter: {
        type: Sequelize.INTEGER
      },
      current_meter: {
        type: Sequelize.INTEGER
      },
      consumption: {
        type: Sequelize.INTEGER
      },
      tariff_per_kwh: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      due_date: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('UNPAID', 'WAITING_VERIFICATION', 'PAID'),
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
    await queryInterface.addConstraint('billings', { //is this correct?
      fields: ['period_month','period_year','electricity_account_id'],
      type: 'unique',
      name: 'unique_billings_periodmonth_periodyear_electricityaccountid'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('billings','unique_billings_periodmonth_periodyear_electricityaccountid');
    await queryInterface.dropTable('billings');
  }
};