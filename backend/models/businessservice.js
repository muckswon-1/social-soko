// src/models/businessservice.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessService extends Model {
    static associate(models) {
      BusinessService.belongsTo(models.Business, { foreignKey: "business_id" });
    }
  }
  BusinessService.init(
    {
      business_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      duration: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BusinessService",
      timestamps: false,
    },
  );
  return BusinessService;
};
