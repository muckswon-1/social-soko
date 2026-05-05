"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessMembershipRequest extends Model {
    static associate(models) {
      BusinessMembershipRequest.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      BusinessMembershipRequest.belongsTo(models.Business, {
        foreignKey: "business_id",
        as: "business",
      });

      BusinessMembershipRequest.belongsTo(models.User, {
        foreignKey: "reviewed_by_user_id",
        as: "reviewedBy",
      });
    }
  }

  BusinessMembershipRequest.init(
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

      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      reviewed_by_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BusinessMembershipRequest",
      tableName: "business_membership_requests",
      timestamps: true,
      underscored: true,
      indexes: [
        // Admin queue: pending requests by business
        {
          fields: ["business_id", "status"],
          name: "business_membership_requests_business_status_idx",
        },
        {
          fields: ["user_id", "status"],
          name: "business_membership_requests_user_status_idx",
        },
      ],
    }
  );

  return BusinessMembershipRequest;
};
