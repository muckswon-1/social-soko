"use strict";

const bcrypt = require("bcrypt");
const { USER_ACCOUNT_ID } = require("../seed_helpers/seed-ids");



require("dotenv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(
      process.env.TEST_ALL_PASSWORD || "netdata_secure_password",
      10
    );

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: USER_ACCOUNT_ID.jacky,

          email: process.env.USER_JACKY_EMAIL,
          password: hashedPassword,

          first_name: "Jacky",
          last_name: "Brandy",

          role: "business", 
          email_verified: true,
          phone_verified: false,

          email_verified_at: new Date(),
          phone_verified_at: null,

          phone: null,

          // Optional metadata fields if present in your schema
          avatar_url: null,
          last_login_at: null,

          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      { id: USER_ACCOUNT_ID.jacky },
      {}
    );
  },
};
