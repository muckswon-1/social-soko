// backend/models/commentlike.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    static associate(models) {
      CommentLike.belongsTo(models.Comment, {
        foreignKey: "comment_id",
        as: "comment",
      });

      CommentLike.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  CommentLike.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      comment_id: {
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
      modelName: "CommentLike",
      tableName: "comment_likes",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["comment_id"] },
        { fields: ["user_id"] },
        { fields: ["created_at"] },
      ],
    }
  );

  return CommentLike;
};
