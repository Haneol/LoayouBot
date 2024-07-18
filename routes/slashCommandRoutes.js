const logger = require("../utils/logger");
const fishingController = require("../controllers/fishingController");
const huntingController = require("../controllers/huntingController");
const calculateController = require("../controllers/calculatorController");
const newsController = require("../controllers/newsController");
const scheduleController = require("../controllers/scheduleController");
const helpController = require("../controllers/helpController");
const archaeologyController = require("../controllers/archaeologyController");

const { checkAPIKey } = require("../middlewares/apiMiddleware");

class SlashCommandRoutes {
  async routes(interaction) {
    const { commandName } = interaction;

    if (commandName === "도움말") {
      logger.info(`유저 ${interaction.member.user.username} : 도움말`);
      await helpController.help(interaction);
    } else if (commandName === "낚시") {
      logger.info(`유저 ${interaction.member.user.username} : 낚시효율`);
      await checkAPIKey(interaction, async () => {
        await fishingController.efficiencyRequest(interaction);
      });
    } else if (commandName === "수렵") {
      logger.info(`유저 ${interaction.member.user.username} : 수렵효율`);
      await checkAPIKey(interaction, async () => {
        await huntingController.efficiencyRequest(interaction);
      });
    } else if (commandName === "고고학") {
      logger.info(`유저 ${interaction.member.user.username} : 고고학효율`);
      await checkAPIKey(interaction, async () => {
        await archaeologyController.efficiencyRequest(interaction);
      });
    } else if (commandName === "경매") {
      logger.info(`유저 ${interaction.member.user.username} : 경매`);
      await calculateController.auctionCalculatorRequest(interaction);
    } else if (commandName === "수수료") {
      logger.info(`유저 ${interaction.member.user.username} : 수수료`);
      await calculateController.sendMoneyCalculatorRequest(interaction);
    } else if (commandName === "공지") {
      logger.info(`유저 ${interaction.member.user.username} : 공지`);
      await checkAPIKey(interaction, async () => {
        await newsController.newsRequest(interaction);
      });
    } else if (commandName === "스케줄") {
      logger.info(`유저 ${interaction.member.user.username} : 스케줄`);
      await checkAPIKey(interaction, async () => {
        await scheduleController.scheduleRequest(interaction);
      });
    }
  }
}

module.exports = SlashCommandRoutes;
