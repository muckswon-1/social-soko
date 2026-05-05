'use strict';

const { BUSINESS_MEMBER_MUCKS_ID, BUSINESS_WON_SOFTWARES_ID, USER_MUCKS_ID } = require('../seed_helpers/seed-ids');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * 
     * */

      await queryInterface.bulkInsert('business_members', [{
        id: BUSINESS_MEMBER_MUCKS_ID,
        business_id: BUSINESS_WON_SOFTWARES_ID,
        user_id: USER_MUCKS_ID,
        role: "owner",
        invited_by: USER_MUCKS_ID,
        invitation_status: "accepted",
        joined_at: new Date(),
     }], {});
    


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * 
     * */
      await queryInterface.bulkDelete('business_members', {id: BUSINESS_MEMBER_MUCKS_ID}, {});
     
  }
};
