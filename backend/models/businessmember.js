'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BusinessMember.belongsTo(models.Business, {foreignKey: "business_id"});
      BusinessMember.belongsTo(models.User, {foreignKey: "user_id"});
      BusinessMember.belongsTo(models.User, {as: "inviter", foreignKey: "invited_by"});

    }
  }
  BusinessMember.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id:{ 
      type: DataTypes.UUID,
      allowNull: false
    },
    role:{
      type: DataTypes.ENUM("owner", "admin", "staff", "viewer"),
      allowNull: false,
      defaultValue: "viewer"
    },
    invited_by:{
      type: DataTypes.UUID,
      allowNull: true,
    },
    invitation_status: {
      type:DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull:false,
      defaultValue: "pending"
    },
    joined_at: {type: DataTypes.DATE, allowNull:true},
  }, {
    sequelize,
    modelName: 'BusinessMember',
    tableName: "business_members",
    timestamps:true,
    underscored: true,
    indexes: [
        { fields: ["business_id"] },
        { fields: ["user_id"] },
        { fields: ["role"] },
        { fields: ["invitation_status"] },
      ],
  });
  return BusinessMember;
};