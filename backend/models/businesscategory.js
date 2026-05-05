// src/models/businesscategory.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessCategory extends Model {
    static associate(models) {
      BusinessCategory.belongsTo(models.Business, {
        foreignKey: "business_id",
      });
      BusinessCategory.belongsTo(models.Category, {
        foreignKey: "category_id",
      });
    }
  }
  BusinessCategory.init(
    {
      business_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BusinessCategory",
      timestamps: false,
    },
  );
  return BusinessCategory;
};
