// src/models/group.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      // Group has many members
      Group.hasMany(models.GroupMember, { foreignKey: 'group_id' });
      // Group has many posts
      Group.hasMany(models.Post, { foreignKey: 'group_id' });
      // Group has many events
      Group.hasMany(models.Event, { foreignKey: 'group_id' });
    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    industry: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Group',
    timestamps: false
  });
  return Group;
};