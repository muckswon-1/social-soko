"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VerificationToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VerificationToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  VerificationToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      token_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "email_verification",
      },
    },
    {
      sequelize,
      modelName: "VerificationToken",
      tableName: "verification_tokens",
      timestamps: true,
      underscored: true
    },
  );
  return VerificationToken;
};
