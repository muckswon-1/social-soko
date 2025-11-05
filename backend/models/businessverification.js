// src/models/businessverification.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessVerification extends Model {
    static associate(models) {
      BusinessVerification.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessVerification.init({
    business_id: DataTypes.INTEGER,
    verification_type: DataTypes.STRING,
    status: DataTypes.STRING,
    submitted_at: DataTypes.DATE,
    reviewed_at: DataTypes.DATE,
    approved_at: DataTypes.DATE,
    rejected_at: DataTypes.DATE,
    notes: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessVerification',
    timestamps: false
  });
  return BusinessVerification;
};