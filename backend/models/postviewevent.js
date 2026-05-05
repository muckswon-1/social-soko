'use strict';
const {
  Model
} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class PostViewEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      PostViewEvent.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // The user who liked the post
      PostViewEvent.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "viewer",
      });


    }
  }
  PostViewEvent.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull:false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull:false,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull:false
    },
    view_source: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_event_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PostViewEvent',
    tableName: 'post_view_events',
    timestamps: true,
    underscored: true,
    indexes: [
      {fields: ["post_id"]},
      {fields: ["user_id"]},
      {fields: ["session_id"]},
      {fields: ["view_source"]},
      {fields: ["client_event_id"]}
    ]
  });
  return PostViewEvent;
};