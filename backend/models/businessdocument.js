// src/models/businessdocument.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessDocument extends Model {
    static associate(models) {
      BusinessDocument.belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessDocument.init({
    business_id: DataTypes.INTEGER,
    document_type: DataTypes.STRING,
    file_path: DataTypes.STRING,
    file_name: DataTypes.STRING,
    uploaded_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BusinessDocument',
    timestamps: false
  });
  return BusinessDocument;
};