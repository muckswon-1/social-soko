// src/models/businesstag.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessTag extends Model {
    static associate(models) {
      BusinessTag.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessTag.init({
    business_id: DataTypes.INTEGER,
    tag_name: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessTag',
    timestamps: false
  });
  return BusinessTag;
};