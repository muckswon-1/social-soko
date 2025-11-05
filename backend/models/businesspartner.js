// src/models/businesspartner.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessPartner extends Model {
    static associate(models) {
      BusinessPartner.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessPartner.init({
    business_id: DataTypes.INTEGER,
    partner_name: DataTypes.STRING,
    partner_description: DataTypes.TEXT,
    partner_url: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessPartner',
    timestamps: false
  });
  return BusinessPartner;
};