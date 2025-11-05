'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      host_business_id: {
        type: Sequelize.UUID
      },
      group_id: {
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING
      },
      starts_at: {
        type: Sequelize.DATE
      },
      ends_at: {
        type: Sequelize.DATE
      },
      location: {
        type: Sequelize.STRING
      },
      description: {
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
    await queryInterface.dropTable('Events');
  }
};