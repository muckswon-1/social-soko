const path = require('path');

const {Sequelize} = require('sequelize');

const env = process.env.NODE_ENV || 'development';
console.log('NODE:ENV: ', env);


const allConfig = require("./config/config");

const config = allConfig[env];

if(!config) {
    console.error("❌ No sequelize config foun for env: ", env);
    process.exit(1);
}

console.log("🛠️ Testing sequelize connection for env: ")
console.log({
      database: config.database,
  username: config.username,
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  ssl: config.dialectOptions && config.dialectOptions.ssl,

})


let sequelize;

if (config.use_env_variable) {
  const url = process.env[config.use_env_variable];
  console.log(`Using env variable ${config.use_env_variable}:`, url);
  sequelize = new Sequelize(url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 4. Try to authenticate
(async () => {
  try {
    console.log("⏳ Trying to authenticate with the database...");
    await sequelize.authenticate();
    console.log("✅ Sequelize connected successfully!");
  } catch (err) {
    console.error("❌ Sequelize failed to connect.");
    console.error("Error name:   ", err.name);
    console.error("Error message:", err.message);

    if (err.parent) {
      console.error("--- parent ---");
      console.error("code:   ", err.parent.code);
      console.error("detail: ", err.parent.detail);
      console.error("hint:   ", err.parent.hint);
      console.error("message:", err.parent.message);
    }

    if (err.original) {
      console.error("--- original ---");
      console.error("code:   ", err.original.code);
      console.error("message:", err.original.message);
    }

    console.error("--- full error object ---");
    console.error(err);
  } finally {
    await sequelize.close().catch(() => {});
    process.exit(0);
  }
})();