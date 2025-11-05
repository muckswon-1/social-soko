// src/models/businesstestimonial.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessTestimonial extends Model {
    static associate(models) {
      BusinessTestimonial.belongsTo(models.Business, { foreignKey: 'business_id' });
      BusinessTestimonial.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  BusinessTestimonial.init({
    business_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    is_approved: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessTestimonial',
    timestamps: false
  });
  return BusinessTestimonial;
};