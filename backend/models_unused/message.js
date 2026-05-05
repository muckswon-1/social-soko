// src/models/message.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: "sender_id" });
      Message.belongsTo(models.User, { foreignKey: "receiver_id" });
    }
  }
  Message.init(
    {
      sender_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      is_read: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Message",
      timestamps: false,
    },
  );
  return Message;
};
