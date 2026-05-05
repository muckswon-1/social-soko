const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbConfig = require("../config/config");

const sequelize = new Sequelize(
  String(dbConfig.database),
  String(dbConfig.username),
  String(dbConfig.password),
  {
    host: String(dbConfig.host),
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
  },
);

module.exports = sequelize;
