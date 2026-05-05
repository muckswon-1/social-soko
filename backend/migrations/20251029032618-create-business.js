"use strict";

module.exports = {
  /** @type {import('sequelize-cli').Migration} */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("businesses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      // Business Handle / @username (unique, primary identifier)
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Human-readable business name (not unique)
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // SEO slug (unique)
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },

      // Owner
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

      // Business description and contact information
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Contact details (not unique, to allow multiple businesses sharing same email)
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },

      logo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Verification status
      verification_status: {
        type: Sequelize.ENUM("pending", "requested", "verified", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },

      verification_requested_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verification_rejected_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verification_rejected_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // Timestamps
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
    await queryInterface.addConstraint("businesses", {
      fields: ["username"],
      type: "unique",
      name: "businesses_username_unique",
    });

    await queryInterface.addIndex("businesses", ["user_id"]);
    await queryInterface.addIndex("businesses", ["city"]);
    await queryInterface.addIndex("businesses", ["state"]);
    await queryInterface.addIndex("businesses", ["country"]);
    await queryInterface.addIndex("businesses", ["postal_code"]);
    await queryInterface.addIndex("businesses", ["verification_status"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop table
    await queryInterface.dropTable("businesses");

    // Drop ENUM type to prevent re-migration conflicts
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_businesses_verification_status";`
    );
  },
};
