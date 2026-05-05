// backend/models/post.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Who created the post (actor)
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "author",
      });

      // Business on whose behalf the post is made
      Post.belongsTo(models.Business, {
        foreignKey: "business_id",
        as: "business",
      });

      // TODO: add groups later:
      // Post.belongsTo(models.Group, {
      //   foreignKey: "group_id",
      //   as: "group",
      // });

      //Social edges (to be created later)
      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        as: "comments",
      });
      //
      Post.hasMany(models.PostLike, {
        foreignKey: "post_id",
        as: "post_likes",
      });

      Post.hasMany(models.PostDislike, {
        foreignKey: "post_id",
        as: "post_dislikes",
      });

    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
      },

      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      group_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: true, // allow media-only posts
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
      visibility: {
        type: DataTypes.ENUM("public", "members", "", "admins_owner", "owner", "custom"),
        allowNull: false,
        defaultValue: "public",
      },

      title: {
        type: DataTypes.STRING(80),
        allowNull: false,

      },

      post_type: {
        type: DataTypes.ENUM("selling", "buying", "launching", "promoting", "informational", "social"),
        allowNull: false,
        defaultValue: "social", // Default to social if not specified
      },

      
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["created_at"] },   // feed sorting
        { fields: ["user_id"] },      // user-based feeds
        { fields: ["business_id"] },  // business profile posts
        { fields: ["visibility"] },   // future filtering if needed
      ],
    },
  );

  return Post;
};
