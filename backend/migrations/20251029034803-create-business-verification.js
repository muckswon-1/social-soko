'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusinessVerifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      business_id: {
        type: Sequelize.INTEGER
      },
      verification_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      submitted_at: {
        type: Sequelize.DATE
      },
      reviewed_at: {
        type: Sequelize.DATE
      },
      approved_at: {
        type: Sequelize.DATE
      },
      rejected_at: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BusinessVerifications');
  }
};