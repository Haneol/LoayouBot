const {
  authenticateUserWithInteraction,
} = require("../middlewares/userMiddleware");
const { checkAPIKey } = require("../middlewares/apiMiddleware");
const logger = require("../utils/logger");

class SlashCommandRoutes {
  async routes(interaction) {
    await authenticateUserWithInteraction(interaction, async () => {
      const { commandName } = interaction;

      if (commandName === "도움말") {
        logger.info(`유저 ${interaction.member.user.username} : 도움말`);
        //await helpController.help(interaction);
      } else if (commandName === "낚시효율") {
        logger.info(`유저 ${interaction.member.user.username} : 낚시효율`);
        await checkAPIKey(interaction, async () => {
          console.log("success");
          //await channelController.createChannelRequest(interaction);
        });
      }
    });
  }
}

module.exports = SlashCommandRoutes;
