// src/models/groupmember.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.Group, { foreignKey: 'group_id' });
      GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  GroupMember.init({
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    role: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'GroupMember',
    timestamps: false
  });
  return GroupMember;
};