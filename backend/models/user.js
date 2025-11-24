// /backend/models/user.js
"use strict";
const { default: phone } = require("phone");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Business, { foreignKey: "user_id" });
      User.hasMany(models.Notification, { foreignKey: "user_id" });
      User.hasMany(models.Message, { foreignKey: "sender_id" });
      User.hasMany(models.Message, { foreignKey: "receiver_id" });
      User.hasMany(models.BusinessReview, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
       first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_verified_at: DataTypes.DATE,

         phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: { len: [2, 255] },
      },

         phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone_verified_at: DataTypes.DATE,

      title: DataTypes.STRING,
      bio: DataTypes.TEXT,
      avatar_url: DataTypes.STRING,
      skills: DataTypes.JSONB,

      role: {
        type: DataTypes.ENUM('admin','business','customer'),
        allowNull: false,
        defaultValue: "customer",
      },
       account_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
       password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      last_login_at: DataTypes.DATE,
      
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: {
          exclude: ["password"]
        }
      },
      scopes: {
        withPassword: {
          attributes: {},
        }
      },
      hooks: {
        beforeSave: (user) => {
          if(user.changed("email_verified")) {
            if(user.email_verified === true){
              user.email_verified_at = new Date();
            } else {
              user.email_verified_at = null;
            
            }
          }

          // TODO Check if phone is verifed too 
          const isVerified = !!user.email_verified;
          user.account_verified = isVerified;


          
        }
      }
    },
  );
  return User;
};
