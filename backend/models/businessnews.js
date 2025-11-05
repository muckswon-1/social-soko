// src/models/businessnews.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessNews extends Model {
    static associate(models) {
      BusinessNews.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessNews.init({
    business_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    published_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessNews',
    timestamps: false
  });
  return BusinessNews;
};