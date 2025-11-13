"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: "post_id" });
      Comment.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Comment.init(
    {
      post_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      body_html: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comment",
      timestamps: false,
    },
  );

  return Comment;
};
