const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const {
  goldEmoji,
  oreha3Emoji,
  rarefish3Emoji,
  uncommonfish3Emoji,
  commonfish3Emoji,
} = require("../models/emoji");

exports.sendEfficiencyEmbedMsg = async (interaction) => {
  // 버튼 추가
  const button = new ButtonBuilder()
    .setCustomId("fishing_efficiency_3tier")
    .setLabel("3티어")
    .setStyle(ButtonStyle.Primary);

  //   const button2 = new ButtonBuilder()
  //     .setCustomId("fishing_efficiency_4tier")
  //     .setLabel("4티어")
  //     .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🎣 낚시 효율")
    .setDescription(
      "현재 재료 가격을 기준으로, 가장 **비싸게 팔 수 있는** 방안을 제시합니다.\n" +
        "1. 오레하 제작 + 남은 생선 판매\n" +
        "  - 융화재료를 최대한으로 제작하고, 남은 생선을 모두 판매합니다.\n" +
        "2. 생선으로만 판매\n" +
        "  - 융화재료 제작 없이, 낚시 재료 그대로를 판매합니다.\n" +
        "3. 추가 생선 구매 후 오레하 제작\n" +
        "  - 제작 시 필요한 3개의 생선 중, 융화재료를 가장 많이 만들 수 있는 생선을 기준으로 나머지 생선을 모두 구매하고 제작하여 판매합니다."
    )
    .addFields(
      {
        name: "필수 입력 항목",
        value: `${rarefish3Emoji} 오레하 태양 잉어, ${uncommonfish3Emoji} 붉은 살 생선, ${commonfish3Emoji} 생선 개수`,
      },
      {
        name: "선택 입력 항목",
        value:
          "제작 대성공 확률: 백분율로 입력해주세요. e.g. 11.3\n제작 비용 감소 확률: 백분율로 입력해주세요. e.g. 5",
      }
    )
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

exports.sendEfficiencyInputModal = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("fishing_efficiency")
    .setTitle("3티어 낚시 효율 계산기");

  const input = new TextInputBuilder()
    .setCustomId("fishing_efficiency_input")
    .setLabel("오레하 태양 잉어 개수를 입력해주세요.")
    .setMaxLength(10)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const input2 = new TextInputBuilder()
    .setCustomId("fishing_efficiency_input2")
    .setMaxLength(10)
    .setRequired(true)
    .setLabel("붉은 살 생선 개수를 입력해주세요.")
    .setStyle(TextInputStyle.Short);

  const input3 = new TextInputBuilder()
    .setCustomId("fishing_efficiency_input3")
    .setMaxLength(10)
    .setRequired(true)
    .setLabel("생선 개수를 입력해주세요.")
    .setStyle(TextInputStyle.Short);

  const input4 = new TextInputBuilder()
    .setCustomId("fishing_efficiency_input4")
    .setMaxLength(10)
    .setRequired(false)
    .setLabel("제작 대성공 확률을 입력해주세요.(백분율)")
    .setStyle(TextInputStyle.Short);

  const input5 = new TextInputBuilder()
    .setCustomId("fishing_efficiency_input5")
    .setMaxLength(10)
    .setRequired(false)
    .setLabel("제작 비용 감소 확률을 입력해주세요.(백분율)")
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder().addComponents(input);
  const row2 = new ActionRowBuilder().addComponents(input2);
  const row3 = new ActionRowBuilder().addComponents(input3);
  const row4 = new ActionRowBuilder().addComponents(input4);
  const row5 = new ActionRowBuilder().addComponents(input5);

  modal.addComponents(row, row2, row3, row4, row5);

  await interaction.showModal(modal);
};

exports.sendEfficiencyCalculateEmbedMsg = async (
  interaction,
  rareFishCount,
  uncommonFishCount,
  commonFishCount,
  orehaPrice,
  rareFishPrice,
  uncommonFishPrice,
  commonFishPrice,
  priceE,
  priceM,
  priceRestFish,
  priceFish,
  priceAdditionalBuy,
  mostEfficient
) => {
  let str;
  if (mostEfficient[0] == 0) {
    str = "오레하 제작 + 남은 생선 판매";
  } else if (mostEfficient[0] == 1) {
    str = "생선으로만 판매";
  } else {
    str = "추가 생선 구매 후 오레하 제작";
  }

  const timestamp = Math.floor(Date.now() / 1000);

  let additionalFishCount = "";
  if (mostEfficient[3][0] > 0) {
    additionalFishCount += `\n  - ${rarefish3Emoji} x ${mostEfficient[3][0]} 세트 구매`;
  }
  if (mostEfficient[3][1] > 0) {
    additionalFishCount += `\n  - ${uncommonfish3Emoji} x ${mostEfficient[3][1]} 세트 구매`;
  }
  if (mostEfficient[3][2] > 0) {
    additionalFishCount += `\n  - ${commonfish3Emoji} x ${mostEfficient[3][2]} 세트 구매`;
  }

  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle(`🎣 ${interaction.user.displayName}님의 낚시 효율`)
    .setDescription(
      `[${rarefish3Emoji}x${rareFishCount} | ${uncommonfish3Emoji}x${uncommonFishCount} | ${commonfish3Emoji}x${commonFishCount}]\n<t:${timestamp}:R>\n가장 효율적인 판매 방법은 아래와 같습니다.\n기대수익: ***${mostEfficient[1]}*** ${goldEmoji}` +
        "```" +
        `឵${str}឵` +
        "```"
    )
    .addFields(
      {
        name: "현재 아이템 가격",
        value: `${oreha3Emoji} 최상급 오레하 융화재료: ***${orehaPrice}*** ${goldEmoji}\n${rarefish3Emoji} 오레하 태양 잉어 x 100: ***${rareFishPrice}*** ${goldEmoji}\n${uncommonfish3Emoji} 붉은 살 생선 x 100: ***${uncommonFishPrice}*** ${goldEmoji}\n${commonfish3Emoji} 생선 x 100: ***${commonFishPrice}*** ${goldEmoji}`,
      },
      {
        name: "최상급 오레하 제작 수익",
        value: `- 오레하 제작 수익(기대값): ***${priceE}*** ${goldEmoji}\n- 오레하 제작 수익(최소값): ***${priceM}*** ${goldEmoji}`,
      },
      {
        name: "남은 물고기 수익",
        value:
          `- 직접 판매: ***${priceRestFish}*** ${goldEmoji}\n- 생선 추가 구매 후, 제작 판매(${oreha3Emoji} ${mostEfficient[2]} 세트): ***${priceAdditionalBuy}*** ${goldEmoji}` +
          additionalFishCount,
      },
      {
        name: "생선 판매",
        value: `오레하 제작 X: ***${priceFish}*** ${goldEmoji}`,
      }
    )
    .setFooter({
      text: `3티어 낚시 효율 계산기`,
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
  });
};

exports.sendEfficiencyCalculateFailEmbedMsg = async (interaction, str) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 낚시 효율")
    .setDescription(str)
    .setFooter({
      text: "그럴 수 있지",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
