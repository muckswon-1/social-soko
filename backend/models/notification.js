// src/models/notification.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Notification.init(
    {
      user_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      message: DataTypes.TEXT,
      is_read: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notification",
      timestamps: false,
    },
  );
  return Notification;
};
