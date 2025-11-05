// src/models/rsvp.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rsvp extends Model {
    static associate(models) {
      // Rsvp belongs to an event
      Rsvp.belongsTo(models.Event, { foreignKey: 'event_id' });
      // Rsvp belongs to a user
      Rsvp.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Rsvp.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('GOING', 'INTERESTED', 'DECLINED'),
      allowNull: false,
      defaultValue: 'INTERESTED'
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Rsvp',
    timestamps: false
  });
  return Rsvp;
};