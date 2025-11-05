// src/models/businessfaq.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessFAQ extends Model {
    static associate(models) {
      BusinessFAQ.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessFAQ.init({
    business_id: DataTypes.INTEGER,
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessFAQ',
    timestamps: false
  });
  return BusinessFAQ;
};