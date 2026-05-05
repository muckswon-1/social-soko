'use strict';
const { BUSINESS_WON_SOFTWARES_ID, USER_MUCKS_ID } = require('../seed_helpers/seed-ids');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert(
      "businesses",
      [
      {
      id: BUSINESS_WON_SOFTWARES_ID,
      username: "won_softwares",
      name: "Mucks Won Softwares",
      description: "Mucks Won Softwares is a software development company that specializes in building web and mobile applications.",
      website: "wonsoftwares.com",
      slug: "won-softwares",
      user_id: USER_MUCKS_ID,
      address: "123 Kimathi St",
      city: "Nairobi",
      postal_code: "50100",
      verification_status: "verified",
      verified_at: new Date(),
      country: "Kenya",
      created_at: new Date(),
      updated_at: new Date(),


    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('businesses', {id: BUSINESS_WON_SOFTWARES_ID}, {})
  }
};
