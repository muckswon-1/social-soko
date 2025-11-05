// src/models/businessevent.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessEvent extends Model {
    static associate(models) {
      BusinessEvent.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessEvent.init({
    business_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    location: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessEvent',
    timestamps: false
  });
  return BusinessEvent;
};