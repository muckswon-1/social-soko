"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("business_memberships", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      role: {
        type: Sequelize.ENUM("member", "admin", "owner"),
        allowNull: false,
        defaultValue: "member",
      },

      status: {
        type: Sequelize.ENUM("active", "banned"),
        allowNull: false,
        defaultValue: "active",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // One membership per user per business
    await queryInterface.addConstraint("business_memberships", {
      fields: ["business_id", "user_id"],
      type: "unique",
      name: "business_memberships_business_user_unique",
    });

    // Indexes for permission checks
    await queryInterface.addIndex("business_memberships", ["business_id"]);
    await queryInterface.addIndex("business_memberships", ["user_id"]);
    await queryInterface.addIndex("business_memberships", ["role"]);
    await queryInterface.addIndex("business_memberships", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("business_memberships");

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_business_memberships_role";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_business_memberships_status";`
    );
  },
};
