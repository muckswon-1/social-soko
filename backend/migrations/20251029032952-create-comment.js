"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
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

      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
         onDelete: "CASCADE",
        onUpdate: "CASCADE",
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

    // Indexes
    await queryInterface.addIndex("comments", ["post_id"]);
    await queryInterface.addIndex("comments", ["user_id"]);
    await queryInterface.addIndex("comments",["parent_id"]);

    await queryInterface.addIndex("comments", ["post_id","parent_id","created_at"]);
    await queryInterface.addIndex("comments",["parent_id","created_at"]);

    await queryInterface.addConstraint("comments",{
      fields: ["id", "parent_id"],
      type: "check",
      name: "comments_parent_not_self",
      where: Sequelize.literal("parent_id IS NULL OR parent_id <> id")
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comments");
  },
};
