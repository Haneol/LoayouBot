const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// 로아유봇 버전 명시
const loayouVersion = "v2.1.0";

exports.sendHelpEmbededMsg = async (msg) => {
  //임베딩 추가
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("❓ 도움말")
    .setFooter({
      text: "로아유봇 /도움말",
      iconURL: "https://imgur.com/ARl3roS.png",
    })
    .setDescription(
      `로아유봇 ${loayouVersion}\n로스트아크와 관련한 여러 편의 기능을 제공합니다.\n\n- 로스트아크 역할이 없다면 사용할 수 없습니다.\n- 특정 기능은 로스트아크 API를 등록해야만 사용할 수 있습니다.\n\n/(Slash Commands)로 명령어를 입력할 수 있습니다.\n전체 명령어는 아래를 참고하세요.
          `
    )
    .addFields(
      {
        name: "**/낚시**",
        value: "낚시 재료 판매 효율을 계산합니다.",
      },
      {
        name: "**/경매**",
        value: "경매 시 손익분기점을 계산합니다.",
      },
      {
        name: "**/수수료**",
        value: "거래 수수료를 포함한 금액을 계산합니다.",
      },
      {
        name: "**/공지**",
        value: "로스트아크 공지사항을 확인합니다.",
      },
      {
        name: "**/스케줄**",
        value: "로스트아크 일일 스케줄을 확인합니다.",
      }
    );

  await msg.reply({ embeds: [embed], ephemeral: true });
};
