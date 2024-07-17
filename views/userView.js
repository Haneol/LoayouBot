const {
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

exports.sendApiInputModal = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("set_api_key")
    .setTitle("API Key 등록");

  const input = new TextInputBuilder()
    .setCustomId("set_api_key_input")
    .setLabel("로스트아크 API Key를 등록해주세요.")
    .setStyle(TextInputStyle.Paragraph);

  const row = new ActionRowBuilder().addComponents(input);

  modal.addComponents(row);

  await interaction.showModal(modal);
};

exports.setApiDoneEmbedMsg = async (interaction) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🔐 API Key가 등록되었습니다.")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

exports.setApiFailEmbedMsg = async (interaction) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 API Key 등록에 실패했습니다.")
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
