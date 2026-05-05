// backend/models/postlike.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    static associate(models) {
     
      PostLike.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // The user who liked the post
      PostLike.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  PostLike.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PostLike",
      tableName: "post_likes",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["post_id"] },
        { fields: ["user_id"] },
        { fields: ["created_at"] },
      ],
    },
  );

  return PostLike;
};
