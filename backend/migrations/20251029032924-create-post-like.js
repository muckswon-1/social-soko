"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_likes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "posts",
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

    // A user can like a specific post only once
    await queryInterface.addConstraint("post_likes", {
      fields: ["post_id", "user_id"],
      type: "unique",
      name: "post_likes_unique_user_per_post",
    });

    // Indexes for fast lookups
    await queryInterface.addIndex("post_likes", ["post_id"]);
    await queryInterface.addIndex("post_likes", ["user_id"]);
    await queryInterface.addIndex("post_likes", ["created_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post_likes");
   
  },
};
