// src/models/businesssociallink.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessSocialLink extends Model {
    static associate(models) {
      BusinessSocialLink.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessSocialLink.init({
    business_id: DataTypes.INTEGER,
    platform: DataTypes.STRING,
    url: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessSocialLink',
    timestamps: false
  });
  return BusinessSocialLink;
};