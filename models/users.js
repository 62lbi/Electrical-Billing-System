'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have many electricity accounts (One-to-Many)
      User.hasMany(models.ElectricityAccount, { foreignKey: 'user_id', as: 'electricityAccounts' });
      // An admin user can verify many payments (One-to-Many)
      User.hasMany(models.Payment, { foreignKey: 'verified_by', as: 'verifiedPayments' });
    }
  }
  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'CUSTOMER'), allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};