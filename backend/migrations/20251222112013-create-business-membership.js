"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("business_membership_requests", {
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

      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      reviewed_by_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // Indexes for queues + lookups
    await queryInterface.addIndex("business_membership_requests", [
      "business_id",
      "status",
    ]);

    await queryInterface.addIndex("business_membership_requests", [
      "user_id",
      "status",
    ]);

    await queryInterface.addIndex("business_membership_requests", [
      "reviewed_by_user_id",
    ]);

    /**
     * IMPORTANT:
     * Enforce only ONE pending request per (business_id, user_id)
     * This uses a partial unique index (Postgres).
     */
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS business_membership_requests_one_pending_unique
      ON business_membership_requests (business_id, user_id)
      WHERE status = 'pending';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("business_membership_requests");

    // Drop ENUM types to prevent re-migration conflicts
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_business_membership_requests_status";`
    );

    // Drop partial index (if it exists)
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS business_membership_requests_one_pending_unique;
    `);
  },
};
