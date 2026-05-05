"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comment_likes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      comment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comments",
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

    // Enforce one-like-per-user-per-comment
    await queryInterface.addConstraint("comment_likes", {
      fields: ["comment_id", "user_id"],
      type: "unique",
      name: "comment_likes_unique_user_per_comment",
    });

    // Useful indexes
    await queryInterface.addIndex("comment_likes", ["comment_id"]);
    await queryInterface.addIndex("comment_likes", ["user_id"]);
    await queryInterface.addIndex("comment_likes", ["created_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comment_likes");
  },
};
