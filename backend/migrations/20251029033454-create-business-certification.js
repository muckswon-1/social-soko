'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusinessCertifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      business_id: {
        type: Sequelize.UUID
      },
      certification_name: {
        type: Sequelize.STRING
      },
      issuing_body: {
        type: Sequelize.STRING
      },
      issue_date: {
        type: Sequelize.DATE
      },
      expiry_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('BusinessCertifications');
  }
};