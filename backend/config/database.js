const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";

const allConfig = require("../config/config")

const config = allConfig[env];

if (!config) {
  console.error("❌ No sequelize config found for env: ", env);
  process.exit(1);
}


let sequelize;


if (config.use_env_variable) {
  const url = process.env[config.use_env_variable];
  sequelize = new Sequelize(url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}




// const sequelize = new Sequelize(
//   String(dbConfig.database),
//   String(dbConfig.username),
//   String(dbConfig.password),
//   {
//     host: String(dbConfig.host),
//     dialect: dbConfig.dialect,
//     logging: dbConfig.logging,
//     pool: dbConfig.pool,
//     dialectOptions: dbConfig.dialectOptions,
//   },
// );

module.exports = sequelize;
