"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessMembership extends Model {
    static associate(models) {
      BusinessMembership.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      BusinessMembership.belongsTo(models.Business, {
        foreignKey: "business_id",
        as: "business",
      });
    }
  }

  BusinessMembership.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("member", "admin", "owner"),
        allowNull: false,
        defaultValue: "member",
      },

      status: {
        type: DataTypes.ENUM("active", "banned"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "BusinessMembership",
      tableName: "business_memberships",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["business_id", "user_id"],
          name: "business_memberships_business_user_unique",
        },
      ],
    }
  );

  return BusinessMembership;
};
