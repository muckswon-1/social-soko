// backend/models/dislike.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostDislike extends Model {
    static associate(models) {
      // The post that was liked
      PostDislike.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // The user who liked the post
      PostDislike.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  PostDislike.init(
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
      modelName: "PostDislike",
      tableName: "post_dislikes",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["post_id"] },
        { fields: ["user_id"] },
        { fields: ["created_at"] },
      ],
    },
  );

  return PostDislike;
};
