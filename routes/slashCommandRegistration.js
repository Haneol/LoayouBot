const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
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
        .setName("낚시")
        .setDescription("낚시 효율을 계산합니다."),
      new SlashCommandBuilder()
        .setName("경매")
        .setDescription("경매 손익을 계산합니다.")
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setName("가격")
            .setDescription("경매 가격을 입력해주세요.")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("수수료")
        .setDescription("거래 수수료를 계산합니다.")
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setName("가격")
            .setDescription("상대방이 받을 가격을 입력해주세요.")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("공지")
        .setDescription("로스트아크 공지사항을 확인합니다.")
        .addStringOption(
          new SlashCommandStringOption()
            .setName("필터")
            .setDescription("필터를 적용하여 공지사항을 확인합니다.")
            .setRequired(false)
            .addChoices(
              { name: "업데이트", value: "업데이트" },
              { name: "공지", value: "공지" },
              { name: "점검", value: "점검" },
              { name: "상점", value: "상점" },
              { name: "이벤트", value: "이벤트" }
            )
        ),
      new SlashCommandBuilder()
        .setName("스케줄")
        .setDescription("오늘의 스케줄을 확인합니다."),
    ];

    await client.application.commands.set([
      ...slashCommands.map((command) => command.toJSON()),
    ]);

    logger.info("Commands registered successfully!");
  } catch (error) {
    logger.error("Error registering commands:", error);
  }
};
