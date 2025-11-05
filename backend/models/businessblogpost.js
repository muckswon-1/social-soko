// src/models/businessblogpost.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessBlogPost extends Model {
    static associate(models) {
      BusinessBlogPost.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessBlogPost.init({
    business_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    excerpt: DataTypes.TEXT,
    published_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessBlogPost',
    timestamps: false
  });
  return BusinessBlogPost;
};