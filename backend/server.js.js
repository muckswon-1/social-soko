
const app = require("./app");
const UTILS = require("./utils/utils");


require("dotenv").config();





const PORT = process.env.SERVER_PORT || 2070;

console.log("Running on port",PORT)

// Start server
start();

async function start() {
  try {
    await UTILS.connectToDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      if (process.env.NODE_ENV === "development") {
        console.log("🌎 Application running in development mode.");
        console.log(" ™️ Developed my Won Softwares");
        console.log("\n");
      }

      if (process.env.NODE_ENV === "test") {
        console.log("🌎 Application running in test mode on port: ", PORT);
        console.log(" ™️ Developed my Won Softwares");
        console.log("\n");
      }

    });
  } catch (error) {
    console.error("❌ Failed to start server: ", error);
    process.exit(1);
  }
}
 