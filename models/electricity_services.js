'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElectricityService extends Model {
    static associate(models) {
      // A service can be used by many electricity accounts (One-to-Many)
      ElectricityService.hasMany(models.ElectricityAccount, { foreignKey: 'electricity_service_id', as: 'electricityAccounts' });
    }
  }
  ElectricityService.init({
    code: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    power_va: { type: DataTypes.INTEGER, allowNull: false },
    price_per_kwh: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'ElectricityService',
    tableName: 'electricity_services'
  });
  return ElectricityService;
};