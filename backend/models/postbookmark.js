// backend/models/postbookmark.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostBookmark extends Model {
    static associate(models) {
      PostBookmark.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
      PostBookmark.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }

  PostBookmark.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      post_id: { type: DataTypes.UUID, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize,
      modelName: "PostBookmark",
      tableName: "post_bookmarks",
      timestamps: true,
      underscored: true,
      indexes: [
        { unique: true, fields: ["post_id", "user_id"] },
        { fields: ["post_id"] },
        { fields: ["user_id"] },
        { fields: ["created_at"] },
      ],
    },
  );

  return PostBookmark;
};
