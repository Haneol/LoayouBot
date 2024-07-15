const { Sequelize } = require("sequelize");
const { User } = require("../config/database");
const logger = require("../utils/logger");

// 사용자 생성
exports.createUser = async (discordUserId) => {
  try {
    await User.create({ discordID: discordUserId });
  } catch (error) {
    throw new Error("사용자 생성에 실패했습니다. (" + error + ")");
  }
};

// 모든 사용자 조회
exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({});
    return users;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 특정 사용자 조회
exports.getUserById = async (userID) => {
  try {
    const user = await User.findByPk(userID, {
      include: [{ model: Role }],
    });
    return user;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 특정 사용자 이름으로 조회
exports.getUserByDiscordID = async (discordID) => {
  try {
    const user = await User.findOne({
      where: { discordID },
    });
    return user;
  } catch (error) {
    throw new Error("사용자 조회에 실패했습니다. (" + error + ")");
  }
};

// 사용자 정보 업데이트
exports.updateUser = async (userID, discordID) => {
  try {
    const [updated] = await User.update({ discordID }, { where: { userID } });
    if (updated) {
      const updatedUser = await User.findByPk(userID);
      return updatedUser;
    }
    return null;
  } catch (error) {
    throw new Error("사용자 업데이트에 실패했습니다. (" + error + ")");
  }
};

// apiKey 업데이트 함수
exports.updateApiKey = async (discordID, apiKey) => {
  try {
    await User.update(
      {
        apiKey,
      },
      {
        where: { discordID },
      }
    );
    logger.info(`User ${discordID} apiKey updated successfully`);
  } catch (error) {
    logger.error("Error updating apiKey:", error);
    throw error;
  }
};

// 사용자 삭제
exports.deleteUser = async (discordID) => {
  try {
    const deleted = await User.destroy({ where: { discordID } });
    return deleted;
  } catch (error) {
    throw new Error("사용자 삭제에 실패했습니다. (" + error + ")");
  }
};
