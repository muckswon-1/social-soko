"use strict";
const bcrypt = require("bcrypt");
const { USER_ACCOUNT_ID } = require("../seed_helpers/seed-ids");




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
      process.env.TEST_ALL_PASSWORD,
      10,
    );

    const testBusinessRoleEmail = process.env.TEST_BUSINESS_ROLE_EMAIL;
    const testAdminRoleEmail = process.env.TEST_ADMIN_ROLE_EMAIL;
    const testCustomerRoleEmail = process.env.TEST_CUSTOMER_ROLE_EMAIL;

    

    await queryInterface.bulkInsert("users", [
  

        {
        id: USER_ACCOUNT_ID.ann,
        email: testAdminRoleEmail,
        password: hashedPassword,
        first_name: "Ann",
        last_name: "Won",
        email_verified: true,
        phone_verified: true,
        email_verified_at: new Date(),
        phone_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        role: "admin",
        phone: "+254114020974",
        
      },

           {
        id: USER_ACCOUNT_ID.cyril,
        email: testCustomerRoleEmail,
        password: hashedPassword,
        first_name: "Cyril",
        last_name: "Mukabwa",
        email_verified: true,
        phone_verified: true,
        email_verified_at: new Date(),
         phone_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        role: "customer",
        phone: "+254729439194",
        
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

    await queryInterface.bulkDelete("users", null, {});
  },
};
