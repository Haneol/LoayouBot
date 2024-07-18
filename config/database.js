const logger = require("../utils/logger");
const { Sequelize } = require("sequelize");
const path = require("path");

async function retryDatabaseOperation(operation, retries = 3, delay = 1000) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.message.includes("SQLITE_BUSY")) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }
  throw lastError;
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
  logging: (message) => {
    logger.info(message);
  },
});

const User = require("../models/user")(sequelize);

const initializeDatabase = async () => {
  try {
    logger.info("Syncing database...");
    await retryDatabaseOperation(() => sequelize.sync({ force: false }));
    logger.info("Database synced.");
  } catch (error) {
    logger.error(`Error during database initialization: ${error.message}`);
  }
};

module.exports = {
  User,
  sequelize,
  initializeDatabase,
};
