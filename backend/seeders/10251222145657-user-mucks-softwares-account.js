"use strict";
const bcrypt = require("bcrypt");
const { USER_ACCOUNT_ID } = require("../seed_helpers/seed-ids");


require("dotenv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(
      process.env.TEST_ALL_PASSWORD,
      10
    );

    await queryInterface.bulkInsert("users", [
      {
        id: USER_ACCOUNT_ID.mucks,
        email: "nextcloud@muckswon.com",
        password: hashedPassword,

        first_name: "Mucks",
        last_name: "Won",

        role: "business",

        email_verified: true,
        phone_verified: false,
        email_verified_at: new Date(),

        phone: "+254700111222",

        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      { id: USER_ACCOUNT_ID.mucks },
      {}
    );
  },
};
