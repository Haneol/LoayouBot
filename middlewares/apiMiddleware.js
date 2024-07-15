const userController = require("../controllers/userController");
const logger = require("../utils/logger");

exports.checkAPIKey = async (interaction, next) => {
  try {
    // API Key가 없다면 API Key 요청
    if (!interaction.loayouUser.apiKey) {
      await userController.setApiKeyRequest(interaction);
    } else {
      next();
    }
  } catch (error) {
    logger.error("Error on api key:", error);
    interaction.reply({
      content: "API Key 등록/사용에 실패했습니다.",
      ephemeral: true,
    });
  }
};
