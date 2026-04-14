// backend/models/comment.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // The post this comment belongs to
      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
       onDelete: "CASCADE",
      });

      // The user who wrote the comment
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "author",
        onDelete: "CASCADE"
      });

      // Comment Likes
      Comment.hasMany(models.CommentLike, {
        foreignKey: "comment_id",
        as: "likes",
        onDelete: "CASCADE"
      });

      Comment.belongsTo(models.Comment, {
        foreignKey: "parent_id",
        as: "parent",
        constraints: true,
        onDelete: "CASCADE"
      });

      Comment.hasMany(models.Comment, {
        foreignKey: "parent_id",
        as: "replies",
        constraints: true,
        onDelete: "CASCADE",
      })
    }
  }

  Comment.init(
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

      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
        
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image_urls: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },

      video_urls: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
      underscored: true,
      indexes: [
      {fields: ["post_id", "parent_id", "created_at"]},
      {fields: ["parent_id", "created_at"]}

      ],
    }
  );

  return Comment;
};
