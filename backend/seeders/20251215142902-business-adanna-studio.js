"use strict";

const { BUSINESS_ACCOUNT_ID, USER_ACCOUNT_ID } = require('../seed_helpers/seed-ids');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "businesses",
      [
        {
          id: BUSINESS_ACCOUNT_ID.adanna_studio,

          username: "adanna_studio",
          slug: "adanna-studio",

          name: "Adanna Studio & Co",
          description:
            "Adanna Studio & Co is a creative brand and commerce studio specializing in handmade goods, digital products, and limited-run lifestyle collections.",

          website: "https://adanna.muckswon.com",

          user_id: USER_ACCOUNT_ID.adanna,

          address: "Westlands Creative Hub",
          city: "Nairobi",
          postal_code: "00800",
          country: "Kenya",

          verification_status: "verified",
          verified_at: new Date(),

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
      { id: BUSINESS_ACCOUNT_ID.adanna_studio },
      {}
    );
  },
};
