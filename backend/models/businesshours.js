// src/models/businesshours.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessHours extends Model {
    static associate(models) {
      BusinessHours.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessHours.init({
    business_id: DataTypes.INTEGER,
    day_of_week: DataTypes.STRING,
    open_time: DataTypes.TIME,
    close_time: DataTypes.TIME,
    is_closed: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessHours',
    timestamps: false
  });
  return BusinessHours;
};