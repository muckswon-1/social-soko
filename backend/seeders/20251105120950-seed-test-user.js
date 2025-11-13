"use strict";
const bcrypt = require("bcrypt");

require("dotenv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const hashedPassword = await bcrypt.hash(
      process.env.TEST_USER_PASSWORD,
      10,
    );
    const testUserEmail = process.env.TEST_USER_EMAIL;

    await queryInterface.bulkInsert("Users", [
      {
        email: testUserEmail,
        password: hashedPassword,
        first_name: "Mucks",
        last_name: "Won",
        email_verified: true,
        phone_verified: true,
        email_verifed_at: new Date(),
        phone_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        role: "business",
        phone: "08012345678",
        
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Users", { email: testUserEmail });
  },
};
