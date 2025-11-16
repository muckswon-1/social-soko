"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Businesses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users", // name of the target table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      postal_code: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
      },
      logo_url: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      verification_status: {
        type: Sequelize.ENUM,
        values: ["pending","requested", "verified", "rejected"],
        defaultValue: "pending",
        allowNull: false,
      },

      verification_requested_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      verification_rejected_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      verification_rejected_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Recommended indexes for performance and search
    await queryInterface.addIndex("Businesses", ["user_id"]);
    await queryInterface.addIndex("Businesses", ["city"]);
    await queryInterface.addIndex("Businesses", ["state"]);
    await queryInterface.addIndex("Businesses", ["country"]);
    await queryInterface.addIndex("Businesses", ["postal_code"]);
    await queryInterface.addIndex("Businesses", ["verification_status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Businesses");
  },
};
