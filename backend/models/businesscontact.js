// src/models/businesscontact.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessContact extends Model {
    static associate(models) {
      BusinessContact.belongsTo(models.Business, { foreignKey: "business_id" });
    }
  }
  BusinessContact.init(
    {
      business_id: DataTypes.INTEGER,
      contact_type: DataTypes.STRING,
      contact_value: DataTypes.STRING,
      is_primary: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BusinessContact",
      timestamps: false,
    },
  );
  return BusinessContact;
};
