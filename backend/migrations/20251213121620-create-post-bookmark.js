"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_bookmarks", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "posts",
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

    // Indexes for performance
    await queryInterface.addIndex("post_bookmarks", ["post_id"]);
    await queryInterface.addIndex("post_bookmarks", ["user_id"]);
    await queryInterface.addIndex("post_bookmarks", ["created_at"]);

    // Prevent duplicate bookmarks by same user on same post
    await queryInterface.addConstraint("post_bookmarks", {
      fields: ["post_id", "user_id"],
      type: "unique",
      name: "unique_post_bookmark_per_user",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("post_bookmarks");
  },
};
