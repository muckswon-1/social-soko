'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owner_user_id: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      industry: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      website: {
        type: Sequelize.STRING
      },
      logo_url: {
        type: Sequelize.STRING
      },
      verified_at: {
        type: Sequelize.DATE
      },
      plan: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Businesses');
  }
};