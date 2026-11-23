'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Belongs to a Billing 
      Payment.belongsTo(models.Billing, { foreignKey: 'billing_id', as: 'billing' });
      // Belongs to a User who verified it (Admin)
      Payment.belongsTo(models.User, { foreignKey: 'verified_by', as: 'verifier' });
    }
  }
  Payment.init({
    billing_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    payment_proof: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('APPROVED', 'REJECTED', 'PENDING') },
    verified_by: { type: DataTypes.INTEGER, allowNull: true },
    verified_at: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });
  return Payment;
};