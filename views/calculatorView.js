const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const { goldEmoji } = require("../models/emoji");

exports.sendMoneyCalculatorEmbedMsg = async (interaction, price) => {
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`💸 거래 수수료 계산기`)
    .setDescription(`보낼 금액 : ***${price}*** ${goldEmoji}`)

    .setFooter({
      text: "로아유봇 /경매",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
  });
};

exports.sendAuctionCalculatorEmbedMsg = async (
  interaction,
  auctionPrice,
  calculatedVal
) => {
  const select = new StringSelectMenuBuilder()
    .setCustomId("auction_calculator")
    .setPlaceholder("인원수를 선택하세요.")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("4인")
        .setDescription("4인 기준 금액을 계산합니다.")
        .setValue("people4"),
      new StringSelectMenuOptionBuilder()
        .setLabel("8인")
        .setDescription("8인 기준 금액을 계산합니다.")
        .setValue("people8")
        .setDefault(true),
      new StringSelectMenuOptionBuilder()
        .setLabel("16인")
        .setDescription("16인 기준 금액을 계산합니다.")
        .setValue("people16")
    );

  const row = new ActionRowBuilder().addComponents(select);

  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`💰 경매 손익 계산기`)
    .setDescription(`입력 금액 : ***${auctionPrice}*** ${goldEmoji}`)
    .addFields(
      {
        name: "직접 사용",
        value: `- 입찰적정가 : ***${calculatedVal[0][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[0][1]}*** ${goldEmoji}`,
      },
      {
        name: "판매 시(min)",
        value: `- 입찰적정가 : ***${calculatedVal[1][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[1][1]}*** ${goldEmoji}\n- 판매차익 : ***${calculatedVal[1][2]}*** ${goldEmoji}`,
        inline: true,
      },
      {
        name: "판매 시(max)",
        value: `- 손익분기점 : ***${calculatedVal[2][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[2][1]}*** ${goldEmoji}\n- 판매차익 : ***${calculatedVal[2][2]}*** ${goldEmoji}`,
        inline: true,
      }
    )

    .setFooter({
      text: "로아유봇 /경매",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    components: [row],
  });
};

exports.updateAuctionCalculatorEmbedMsg = async (
  interaction,
  auctionPrice,
  calculatedVal,
  defaultVal
) => {
  const select = new StringSelectMenuBuilder()
    .setCustomId("auction_calculator")
    .setPlaceholder("인원수를 선택하세요.")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("4인")
        .setDescription("4인 기준 금액을 계산합니다.")
        .setValue("people4")
        .setDefault(defaultVal[0]),
      new StringSelectMenuOptionBuilder()
        .setLabel("8인")
        .setDescription("8인 기준 금액을 계산합니다.")
        .setValue("people8")
        .setDefault(defaultVal[1]),
      new StringSelectMenuOptionBuilder()
        .setLabel("16인")
        .setDescription("16인 기준 금액을 계산합니다.")
        .setValue("people16")
        .setDefault(defaultVal[2])
    );

  const row = new ActionRowBuilder().addComponents(select);

  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`💰 경매 손익 계산기`)
    .setDescription(`입력 금액 : ***${auctionPrice}*** ${goldEmoji}`)
    .addFields(
      {
        name: "직접 사용",
        value: `- 입찰적정가 : ***${calculatedVal[0][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[0][1]}*** ${goldEmoji}`,
      },
      {
        name: "판매 시(min)",
        value: `- 입찰적정가 : ***${calculatedVal[1][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[1][1]}*** ${goldEmoji}\n- 판매차익 : ***${calculatedVal[1][2]}*** ${goldEmoji}`,
        inline: true,
      },
      {
        name: "판매 시(max)",
        value: `- 손익분기점 : ***${calculatedVal[2][0]}*** ${goldEmoji}\n- 분배금 : ***${calculatedVal[2][1]}*** ${goldEmoji}\n- 판매차익 : ***${calculatedVal[2][2]}*** ${goldEmoji}`,
        inline: true,
      }
    )

    .setFooter({
      text: "로아유봇 /경매",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
};
