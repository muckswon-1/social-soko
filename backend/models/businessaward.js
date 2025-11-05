// src/models/businessaward.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessAward extends Model {
    static associate(models) {
      BusinessAward.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessAward.init({
    business_id: DataTypes.INTEGER,
    award_name: DataTypes.STRING,
    award_description: DataTypes.TEXT,
    year: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessAward',
    timestamps: false
  });
  return BusinessAward;
};