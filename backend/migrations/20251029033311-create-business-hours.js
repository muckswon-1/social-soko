"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BusinessHours", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      business_id: {
        type: Sequelize.UUID,
      },
      day_of_week: {
        type: Sequelize.STRING,
      },
      open_time: {
        type: Sequelize.TIME,
      },
      close_time: {
        type: Sequelize.TIME,
      },
      is_closed: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BusinessHours");
  },
};
