// src/models/businessimage.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessImage extends Model {
    static associate(models) {
      BusinessImage.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessImage.init({
    business_id: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    alt_text: DataTypes.STRING,
    is_primary: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessImage',
    timestamps: false
  });
  return BusinessImage;
};