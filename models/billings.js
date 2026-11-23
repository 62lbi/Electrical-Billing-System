'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Billing extends Model {
    static associate(models) {
      // Belongs to an Electricity Account
      Billing.belongsTo(models.ElectricityAccount, { foreignKey: 'electricity_account_id', as: 'electricityAccount' });
      // Has one payment record (One-to-One)
      Billing.hasOne(models.Payment, { foreignKey: 'billing_id', as: 'payment' });
    }
  }
  Billing.init({
    electricity_account_id: { type: DataTypes.INTEGER, allowNull: false },
    period_month: { type: DataTypes.STRING, allowNull: false },
    period_year: { type: DataTypes.INTEGER, allowNull: false },
    previous_meter: { type: DataTypes.INTEGER },
    current_meter: { type: DataTypes.INTEGER },
    consumption: { type: DataTypes.INTEGER },
    tariff_per_kwh: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.INTEGER },
    due_date: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('UNPAID', 'WAITING_VERIFICATION', 'PAID'), allowNull: false }
  }, {
    sequelize,
    modelName: 'Billing',
    tableName: 'billings'
  });
  return Billing;
};