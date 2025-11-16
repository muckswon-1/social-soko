// src/models/business.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.belongsTo(models.User, { foreignKey: "user_id" });
      Business.hasMany(models.BusinessVerification, {
        foreignKey: "business_id",
      });
      Business.hasMany(models.BusinessDocument, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessContact, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessCategory, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessSocialLink, {
        foreignKey: "business_id",
      });
      Business.hasMany(models.BusinessImage, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessService, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessTestimonial, {
        foreignKey: "business_id",
      });
      Business.hasMany(models.BusinessReview, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessAward, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessCertification, {
        foreignKey: "business_id",
      });
      Business.hasMany(models.BusinessEvent, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessNews, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessBlogPost, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessFAQ, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessPartner, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessTag, { foreignKey: "business_id" });
      Business.hasMany(models.BusinessHours, { foreignKey: "business_id" });
    }
  }
  Business.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [2, 255] },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING,
        validate: { len: [5, 20] },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
      },

      website: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      logo_url: DataTypes.STRING,
      verification_status: {
        type: DataTypes.ENUM("pending","requested", "verified", "rejected"),
        defaultValue: "pending",
      },
      verification_requested_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      verification_rejected_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      verification_rejected_reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: "Business",
      tableName: "Businesses",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["city"] },
        { fields: ["state"] },
        { fields: ["country"] },
        { fields: ["postal_code"] },
        { fields: ["verification_status"] },
      ],
    },
  );
  return Business;
};
