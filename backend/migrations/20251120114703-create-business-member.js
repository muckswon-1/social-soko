"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("business_members", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "businesses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      role: {
        type: Sequelize.ENUM("owner", "admin", "staff", "viewer"),
        allowNull: false,
        defaultValue: "viewer",
      },

      invitation_status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },

      invited_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },

      joined_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("business_members", ["business_id"]);
    await queryInterface.addIndex("business_members", ["user_id"]);
    await queryInterface.addIndex("business_members", ["role"]);
    await queryInterface.addIndex("business_members", ["invitation_status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("business_members");
  },
};
