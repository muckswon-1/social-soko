'use strict';

const fs = require('fs');
const path = require('path');

// Load environment variables
const env = process.env.NODE_ENV || 'development'; 


const configPath = path.join(__dirname, '..', '.env');


if (fs.existsSync(configPath)) {
  require('dotenv').config({ path: configPath });
}

const config = {
  development: {
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquireTimeout: 30000,
      idleTimeout: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'social_soko_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
       pool: {
      max: 5,
      min: 0,
      acquireTimeout: 30000,
      idleTimeout: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
       pool: {
      max: 5,
      min: 0,
      acquireTimeout: 30000,
      idleTimeout: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};


module.exports = config[env];
