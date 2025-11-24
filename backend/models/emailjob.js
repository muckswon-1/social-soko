"use strict";

const {Model} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
   class EmailJob extends Model {
    static associate(models) {
      EmailJob.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  

     EmailJob.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      template: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payload: {
        type: DataTypes.JSONB, 
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_error: {
        type: DataTypes.TEXT,
      },
      scheduled_at: DataTypes.DATE,
      sent_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EmailJob",
      tableName: "email_jobs",
      timestamps: true,
      underscored: true,
    }
  );

  return EmailJob;
}