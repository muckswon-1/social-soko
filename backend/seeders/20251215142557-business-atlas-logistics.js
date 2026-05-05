"use strict";

const { BUSINESS_ACCOUNT_ID, USER_ACCOUNT_ID } = require('../seed_helpers/seed-ids');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "businesses",
      [
        {
          id: BUSINESS_ACCOUNT_ID.atlas_logistics,

          username: "atlas_logistics",
          slug: "atlas-logistics",

          name: "Atlas Logistics Group",
          description:
            "Atlas Logistics Group provides regional and cross-border freight forwarding, warehousing, and last-mile delivery solutions for growing businesses across East Africa.",

          website: "https://atlaslogistics.co",

          user_id: USER_ACCOUNT_ID.mucks,

          address: "Mombasa Road Industrial Area",
          city: "Nairobi",
          postal_code: "00200",
          country: "Kenya",

          verification_status: "pending",
          verified_at: null,

          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "businesses",
      { id: BUSINESS_ACCOUNT_ID.atlas_logistics },
      {}
    );
  },
};
