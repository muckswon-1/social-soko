// backend/config/config.js
"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
const rootDir = path.join(__dirname, "..");

// Prefer .env.development / .env.test etc., then fallback to .env
const envFile = path.join(rootDir, `.env.${env}`);
const defaultEnvFile = path.join(rootDir, ".env");

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else if (fs.existsSync(defaultEnvFile)) {
  dotenv.config({ path: defaultEnvFile });
}

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

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: Number(process.env.DB_PORT) ,
    dialect: "postgres",
    logging: false,
    pool: basePool,
    dialectOptions: baseDialectOptions,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
    pool: basePool,
    dialectOptions: baseDialectOptions,
  },
  production: {
    // Either use discrete env vars:
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
    pool: basePool,
    dialectOptions: baseDialectOptions,

    // OR you can switch to:
    // use_env_variable: "DATABASE_URL",
  },
};
