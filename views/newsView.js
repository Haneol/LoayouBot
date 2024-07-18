const { EmbedBuilder } = require("discord.js");

const {
  miniCheckEmoji,
  miniEventEmoji,
  miniNewsEmoji,
  miniShopEmoji,
  miniUpdateEmoji,
} = require("../models/emoji");

exports.sendNewsEmbedMsg = async (interaction, news, type) => {
  let str = "";
  if (type != null) {
    str = str + type + "\n";
  }
  for (let i = 0; i < 7; i++) {
    str += `- ${type != null ? "" : emoji(news[i])} [${news[i].Title}](${
      news[i].Link
    }) <t:${Math.floor(new Date(news[i].Date).getTime() / 1000)}:R>\n`;
  }

  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`📢 공지사항`)
    .setDescription(str)
    .setFooter({
      text: "로아유봇 /공지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
  });
};

exports.sendNewsFailEmbedMsg = async (interaction, str) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 공지사항")
    .setDescription(str)
    .setFooter({
      text: "로아유봇 /공지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

function emoji(news) {
  let type = news.Type;
  if (news.Type === "공지" && /업데이트/.test(news.Title)) {
    type = "업데이트";
  }

  switch (type) {
    case "업데이트":
      return miniUpdateEmoji;
    case "공지":
      return miniNewsEmoji;
    case "점검":
      return miniCheckEmoji;
    case "상점":
      return miniShopEmoji;
    case "이벤트":
      return miniEventEmoji;
  }
}
