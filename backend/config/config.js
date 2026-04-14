// backend/config/config.js
"use strict";
// const fs = require("fs");
 const path = require("path");

const rootDir = path.join(__dirname, "..");

const env = process.env.NODE_ENV || "development";
const envFile = path.join(rootDir, `.env.${env}`);

 console.log("Env File: ",envFile);


console.log("This is the root directory: ", rootDir);


require("dotenv").config({path: envFile});


// helper for boolean envs
const bool = (val, fallback = false) => {
  if (val === undefined) return fallback;
  return String(val).toLowerCase() === "true";
};

const basePool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};

const baseDialectOptions = {
  ssl: bool(process.env.DB_SSL)
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : false,
};

// ✅ common config used by development + docker
const devLikeConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  logging: false,
  pool: basePool,
  dialectOptions: baseDialectOptions,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  migrationStorageTableName: "sequelize_meta",
};

module.exports = {
  // Local development (non-docker)
  development: devLikeConfig,

  // ✅ Docker environment used inside containers (NODE_ENV=docker)
  docker: devLikeConfig,

  test: {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  logging: false,
  pool: basePool,
  dialectOptions: baseDialectOptions,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  migrationStorageTableName: "sequelize_meta",
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
    pool: basePool,
    dialectOptions: baseDialectOptions,
  },
};
