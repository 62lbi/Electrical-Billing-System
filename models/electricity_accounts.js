'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElectricityAccount extends Model {
    static associate(models) {
      // Belongs to a User
      ElectricityAccount.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      // Belongs to an Electricity Service
      ElectricityAccount.belongsTo(models.ElectricityService, { foreignKey: 'electricity_service_id', as: 'electricityService' });
      // Has many billings (One-to-Many)
      ElectricityAccount.hasMany(models.Billing, { foreignKey: 'electricity_account_id', as: 'billings' });
    }
  }
  ElectricityAccount.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    electricity_service_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_number: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    customer_name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'UNACTIVE'), allowNull: false }
  }, {
    sequelize,
    modelName: 'ElectricityAccount',
    tableName: 'electricity_accounts'
  });
  return ElectricityAccount;
};