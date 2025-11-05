// src/models/businesscertification.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessCertification extends Model {
    static associate(models) {
      BusinessCertification.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessCertification.init({
    business_id: DataTypes.INTEGER,
    certification_name: DataTypes.STRING,
    issuing_body: DataTypes.STRING,
    issue_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessCertification',
    timestamps: false
  });
  return BusinessCertification;
};