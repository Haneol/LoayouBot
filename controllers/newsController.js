const ApiUtil = require("../utils/apiUtil");
const newsView = require("../views/newsView");

const {
  miniCheckEmoji,
  miniEventEmoji,
  miniNewsEmoji,
  miniShopEmoji,
  miniUpdateEmoji,
} = require("../models/emoji");

exports.newsRequest = async (interaction) => {
  const apiKey = interaction.loayouUser.apiKey;
  const filter = interaction.options.getString("필터");

  const api = new ApiUtil("https://developer-lostark.game.onstove.com", apiKey);

  try {
    let news;
    let type = null;
    if (filter == "업데이트") {
      news = await api.get(
        "/news/notices?searchText=%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8"
      );
      type = `${miniUpdateEmoji} **업데이트**`;
    } else if (filter == "공지") {
      news = await api.get("/news/notices?type=%EA%B3%B5%EC%A7%80");
      type = `${miniNewsEmoji} **공지**`;
    } else if (filter == "점검") {
      news = await api.get("/news/notices?type=%EC%A0%90%EA%B2%80");
      type = `${miniCheckEmoji} **점검**`;
    } else if (filter == "상점") {
      news = await api.get("/news/notices?type=%EC%83%81%EC%A0%90");
      type = `${miniShopEmoji} **상점**`;
    } else if (filter == "이벤트") {
      news = await api.get("/news/notices?type=%EC%9D%B4%EB%B2%A4%ED%8A%B8");
      type = `${miniEventEmoji} **이벤트**`;
    } else {
      news = await api.get("/news/notices");
    }

    await newsView.sendNewsEmbedMsg(interaction, news, type);
  } catch (e) {
    logger.error("ERROR calculate fishing efficiency: ", e);
    await newsView.sendNewsFailEmbedMsg(
      interaction,
      "공지사항을 불러오는데 실패하였습니다."
    );
  }
};
