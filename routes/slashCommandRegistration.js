const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const logger = require("../utils/logger");

exports.run = async (client) => {
  try {
    logger.info("Registering commands...");

    // 슬래시 명령어 등록
    const slashCommands = [
      new SlashCommandBuilder()
        .setName("도움말")
        .setDescription("로아유봇에 대한 도움말을 확인합니다."),
      new SlashCommandBuilder()
        .setName("낚시효율")
        .setDescription("낚시 효율을 계산합니다."),
    ];

    await client.application.commands.set([
      ...slashCommands.map((command) => command.toJSON()),
    ]);

    logger.info("Commands registered successfully!");
  } catch (error) {
    logger.error("Error registering commands:", error);
  }
};
