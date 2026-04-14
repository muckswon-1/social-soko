"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      group_id: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      image_urls: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },

      video_urls: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      
      visibility: {
        type: Sequelize.ENUM("public", "members", "admins_owner", "owner", "custom"),
        allowNull: false,
        defaultValue: "public",
      },

      title: {
        type: Sequelize.STRING(80),
        allowNull: false,

      },

      post_type: {
        type: Sequelize.ENUM("selling", "buying", "launching", "promoting", "informational", "social"),
        allowNull: false,
        defaultValue: "social", // Default to social if not specified
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

    // Indexes for feed & lookups
    await queryInterface.addIndex("posts", ["created_at"]);
    await queryInterface.addIndex("posts", ["user_id"]);
    await queryInterface.addIndex("posts", ["business_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("posts");

    // Drop ENUM type for visibility (Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_posts_visibility";'
    );
  },
};
