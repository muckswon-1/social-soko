// src/models/business.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.belongsTo(models.User, { foreignKey: 'user_id' });
      Business.hasMany(models.BusinessVerification, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessDocument, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessContact, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessCategory, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessSocialLink, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessImage, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessService, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessTestimonial, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessReview, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessAward, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessCertification, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessEvent, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessNews, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessBlogPost, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessFAQ, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessPartner, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessTag, { foreignKey: 'business_id' });
      Business.hasMany(models.BusinessHours, { foreignKey: 'business_id' });
    }
  }
  Business.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    logo_url: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    verification_token: DataTypes.STRING,
    token_expires: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Business',
    timestamps: false
  });
  return Business;
};