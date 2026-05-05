'use strict';

const { BUSINESS_MEMBER_ID, BUSINESS_ACCOUNT_ID, USER_ACCOUNT_ID } = require('../seed_helpers/seed-ids');



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * 
     * */

      await queryInterface.bulkInsert('business_memberships', [{
        id: BUSINESS_MEMBER_ID.mucks,
        business_id: BUSINESS_ACCOUNT_ID.won_softwares,
        user_id: USER_ACCOUNT_ID.mucks,
        role: "owner",
        status: "active"
     }], {});

      await queryInterface.bulkInsert('business_memberships', [{
        id: BUSINESS_MEMBER_ID.mucks2,
        business_id: BUSINESS_ACCOUNT_ID.atlas_logistics,
        user_id: USER_ACCOUNT_ID.mucks,
        role: "owner",
        status: "active"
     }], {});

      await queryInterface.bulkInsert('business_memberships', [{
        id: BUSINESS_MEMBER_ID.jacky_owner,
        business_id: BUSINESS_ACCOUNT_ID.netdata,
        user_id: USER_ACCOUNT_ID.jacky,
        role: "owner",
        status: "active"
     }], {});




       await queryInterface.bulkInsert('business_memberships', [{
        id: BUSINESS_MEMBER_ID.netdata,
        business_id: BUSINESS_ACCOUNT_ID.won_softwares,
        user_id: USER_ACCOUNT_ID.jacky,
        role: "member",
        status: "active"
     }], {});

       await queryInterface.bulkInsert('business_memberships', [{
        id: BUSINESS_MEMBER_ID.cyril,
        business_id: BUSINESS_ACCOUNT_ID.won_softwares,
        user_id: USER_ACCOUNT_ID.cyril,
        role: "admin",
        status: "active"
     }], {});

     await queryInterface.bulkInsert('business_memberships', [{
      id: BUSINESS_MEMBER_ID.adanna,
      business_id: BUSINESS_ACCOUNT_ID.adanna_studio,
      user_id: USER_ACCOUNT_ID.adanna,
      role: "owner",
      status: "active"

     }])




    


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * 
     * */
      await queryInterface.bulkDelete('business_members', {id: BUSINESS_MEMBER_ID.mucks}, {});
     
  }
};
