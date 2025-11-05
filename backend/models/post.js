// src/models/post.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Business, { foreignKey: 'business_id' });
      Post.belongsTo(models.Group, { foreignKey: 'group_id' });
      Post.hasMany(models.Comment, { foreignKey: 'post_id' });
      Post.hasMany(models.PostLike, { foreignKey: 'post_id' });
    }
  }
  Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    business_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    body_html: DataTypes.TEXT,
    visibility: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
    timestamps: false
  });
  return Post;
};