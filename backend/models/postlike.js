// src/models/postlike.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    static associate(models) {
      PostLike.belongsTo(models.Post, { foreignKey: 'post_id' });
      PostLike.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PostLike.init({
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostLike',
    timestamps: false
  });
  return PostLike;
};