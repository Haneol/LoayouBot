const userRepository = require("../repositories/userRepository");
const logger = require("../utils/logger");

exports.authenticateUserWithInteraction = async (interaction, next) => {
  try {
    // 사용자 조회
    const discordUserId = interaction.member.id;
    let user = await userRepository.getUserByDiscordID(discordUserId);

    // 사용자가 없다면 사용자 생성
    if (!user) {
      logger.info("사용자 생성 중");

      await userRepository.createUser(discordUserId);
      user = await userRepository.getUserByDiscordID(discordUserId);
      logger.info(`New user created: ${user.discordID}`);
    }

    // 사용자 ID를 메시지 객체에 저장
    interaction.loayouUser = user;

    next();
  } catch (error) {
    logger.error("Error authenticating user:", error);
    interaction.reply({
      content: "사용자 인증에 실패했습니다.",
      ephemeral: true,
    });
  }
};
