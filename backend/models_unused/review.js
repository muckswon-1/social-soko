// src/models/review.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessReview extends Model {
    static associate(models) {
      BusinessReview.belongsTo(models.Business, { foreignKey: "business_id" });
      BusinessReview.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  BusinessReview.init(
    {
      business_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      is_approved: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BusinessReview",
      timestamps: false,
    },
  );
  return BusinessReview;
};
