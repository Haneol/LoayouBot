const logger = require("../utils/logger");
const fishingController = require("../controllers/fishingController");

const { checkAPIKey } = require("../middlewares/apiMiddleware");

class SlashCommandRoutes {
  async routes(interaction) {
    const { commandName } = interaction;

    if (commandName === "도움말") {
      logger.info(`유저 ${interaction.member.user.username} : 도움말`);
      //await helpController.help(interaction);
    } else if (commandName === "낚시효율") {
      logger.info(`유저 ${interaction.member.user.username} : 낚시효율`);
      await checkAPIKey(interaction, async () => {
        await fishingController.efficiencyRequest(interaction);
      });
    }
  }
}

module.exports = SlashCommandRoutes;
