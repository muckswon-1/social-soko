"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessVideo extends Model {
    static associate(models) {
      BusinessVideo.belongsTo(models.Business, { foreignKey: "business_id" });
    }
  }
  BusinessVideo.init(
    {
      business_id: DataTypes.UUID,
      video_url: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BusinessVideo",
      timestamps: false,
    },
  );
  return BusinessVideo;
};
