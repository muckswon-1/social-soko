// src/models/business.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
  // Owner of the business
  Business.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "owner",
  });

  // Posts under this business
  Business.hasMany(models.Post, {
    foreignKey: "business_id",
    as: "posts",
  });

  // Approved memberships
  Business.hasMany(models.BusinessMembership, {
    foreignKey: "business_id",
    as: "memberships",
  });

  // Join requests
  Business.hasMany(models.BusinessMembershipRequest, {
    foreignKey: "business_id",
    as: "membershipRequests",
  });

  // Optional convenience (recommended)
  Business.belongsToMany(models.User, {
    through: models.BusinessMembership,
    foreignKey: "business_id",
    otherKey: "user_id",
    as: "users",
  });
}

  }

  Business.init(
    {
      // Handle / @username used for display & UX
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30],
          is: /^[a-z0-9_-]+$/i, // @handle style: letters, numbers, _ and -
        },
      },

      // Human-facing business name (not unique – different companies can share names)
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 255] },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // SEO / URL slug, still unique
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      // Owner / primary user
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      // Location & address info
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Contact details (no longer unique – multiple businesses can share)
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          lenIfProvided(value) {
            if(!value || value.trim() === "") return;
            if(value.length < 10 || value.length > 15) throw new Error("Phone number must be between 10 and 15 characters")
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },

      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      verification_status: {
        type: DataTypes.ENUM("pending", "requested", "verified", "rejected"),
        defaultValue: "pending",
      },
      verification_requested_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verification_rejected_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verification_rejected_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Business",
      tableName: "businesses",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["username"] },
        { fields: ["slug"] },
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
