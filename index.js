const { Client, Events, GatewayIntentBits } = require("discord.js");
const logger = require("./utils/logger");
const { token } = require("./config.json");

const slashCommandRegistration = require("./routes/slashCommandRegistration");

const { sequelize, initializeDatabase } = require("./config/database");
const {
  authenticateUserWithInteraction,
} = require("./middlewares/userMiddleware");

const SlashCommandRoutes = require("./routes/slashCommandRoutes");
const ButtonInteractionEvent = require("./events/buttonInteractionEvent");
const ModalInteractionEvent = require("./events/modalInteractionEvent");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  client.user.setPresence({
    activities: [{ name: "LOST ARK" }],
    status: "online",
  });

  await slashCommandRegistration.run(client);

  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    await initializeDatabase(client);
    await sequelize.sync(); // Model & Database Sync
    logger.info("Database synced");
    //await helpController.run(client);
    logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
});

const slashCommandRoutes = new SlashCommandRoutes();
const buttonInteractionEvent = new ButtonInteractionEvent();
const modalInteractionEvent = new ModalInteractionEvent();

// 상호작용 이벤트 처리
client.on(Events.InteractionCreate, async (interaction) => {
  await authenticateUserWithInteraction(interaction, async () => {
    try {
      if (interaction.isButton())
        await buttonInteractionEvent.event(interaction);
      else if (interaction.isModalSubmit())
        await modalInteractionEvent.event(interaction);
      else if (interaction.isChatInputCommand())
        await slashCommandRoutes.routes(interaction);
    } catch (error) {
      logger.error("Error handling interaction:", error);
    }
  });
});

// SIGINT 이벤트 핸들러 (Ctrl+C로 봇 종료 시)
process.on("SIGINT", async () => {
  try {
    logger.info("Stop! Ctrl+C");
    process.exit();
  } catch (error) {
    logger.error("시스템 종료 중 이상 발생:", error);
    process.exit(1);
  }
});

// uncaughtException 이벤트 핸들러 (예기치 않은 에러로 봇 종료 시)
process.on("uncaughtException", async (error) => {
  logger.error("예기치 않은 에러 발생:", error);
  try {
    logger.info("Stop! uncaughtException");
    process.exit(1);
  } catch (error) {
    logger.error("시스템 종료 중 이상 발생:", error);
    process.exit(1);
  }
});

client.login(token);
