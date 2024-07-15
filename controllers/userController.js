const axios = require("axios");
const userView = require("../views/userView");
const userRepository = require("../repositories/userRepository");
const logger = require("../utils/logger");

exports.setApiKeyRequest = async (interaction) => {
  await userView.sendApiInputModal(interaction);
};

exports.setApiKey = async (interaction) => {
  const apiKey = interaction.fields.getTextInputValue("set_api_key_input");
  const apiUrl = "https://developer-lostark.game.onstove.com/news/notices";

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        accept: "application/json",
        authorization: `bearer ${apiKey}`,
      },
    });

    if (response) {
      await userRepository.updateApiKey(
        interaction.loayouUser.discordID,
        apiKey
      );
      await userView.setApiDoneEmbedMsg(interaction);
    }
  } catch (e) {
    logger.error("ERROR in APIkey: ", e);
    await userView.setApiFailEmbedMsg(interaction);
  }
};
