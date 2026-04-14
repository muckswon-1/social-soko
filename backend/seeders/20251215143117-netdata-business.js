"use strict";

const {
  USER_ACCOUNT_ID,
  BUSINESS_ACCOUNT_ID,
} = require("../seed_helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "businesses",
      [
        {
          id: BUSINESS_ACCOUNT_ID.netdata,

          username: "netdata",
          slug: "netdata-monitoring",

          name: "Netdata Monitoring",
          description:
            "Netdata Monitoring is an internal infrastructure analytics service used to collect, visualize, and alert on system performance, application health, and operational metrics across the Muckswon platform.",

          website: "https://netdata.muckswon.com",

          user_id: USER_ACCOUNT_ID.jacky,

          address: "Internal Infrastructure",
          city: "Global",
          postal_code: null,
          country: "Cloud",

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
      { id: BUSINESS_ACCOUNT_ID.netdata },
      {}
    );
  },
};
