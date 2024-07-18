const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const logger = require("../utils/logger");

const {
  chaosGateEmoji,
  fieldBossEmoji,
  chaosGateXEmoji,
  fieldBossXEmoji,
  goldEmoji,
  oceanCoinEmoji,
  shillingEmoji,
  cardEmoji,
} = require("../models/emoji");

exports.sendScheduleEmbedMsg = async (
  interaction,
  island,
  chaosGate,
  fieldBoss
) => {
  let str = "";

  if (chaosGate[0]) {
    str =
      str +
      `${chaosGateEmoji} **카오스게이트** <t:${chaosGate[1]}:R> **출현**\n`;
  } else {
    str += `${chaosGateXEmoji} X\n`;
  }

  if (fieldBoss[0]) {
    str =
      str + `${fieldBossEmoji} **필드보스** <t:${fieldBoss[1]}:R> **등장**\n`;
  } else {
    str += `${fieldBossXEmoji} X\n`;
  }

  try {
    const attachment = await mergeImagesForEmbed(
      island[0][1],
      island[1][1],
      island[2][1]
    );

    const embed = new EmbedBuilder()
      .setColor(0xf14966)
      .setTitle(`🗓️ 스케줄`)
      .setDescription(str)
      .addFields(
        {
          name: `${island[0][0]}`,
          value: `${emojiStr(island[0][3])}\n<t:${island[0][2]}:R>`,
          inline: true,
        },
        {
          name: `${island[1][0]}`,
          value: `${emojiStr(island[1][3])}\n<t:${island[1][2]}:R>`,
          inline: true,
        },
        {
          name: `${island[2][0]}`,
          value: `${emojiStr(island[2][3])}\n<t:${island[2][2]}:R>`,
          inline: true,
        }
      )
      .setThumbnail("attachment://merged_image.png")
      .setFooter({
        text: "스케줄",
        iconURL: "https://imgur.com/IhMjCEt.jpg",
      });

    await interaction.reply({
      embeds: [embed],
      files: [attachment],
    });
  } catch (e) {
    logger.error("Error in scheduleView: ", e);
  }
};

exports.sendScheduleFailEmbedMsg = async (interaction, str) => {
  // 임베드 메시지 생성
  const embed = new EmbedBuilder()
    .setColor(0xf14966)
    .setTitle("🚫 스케줄")
    .setDescription(str)
    .setFooter({
      text: "스케줄",
      iconURL: "https://imgur.com/IhMjCEt.jpg",
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

function emojiStr(str) {
  switch (str) {
    case "골드":
      return `${goldEmoji} ${str}`;
    case "대양의 주화":
      return `${oceanCoinEmoji} ${str}`;
    case "카드 팩":
      return `${cardEmoji} ${str}`;
    case "실링":
      return `${shillingEmoji} ${str}`;
  }
}

async function mergeImagesForEmbed(imageUrl1, imageUrl2, imageUrl3) {
  try {
    const [img1, img2, img3] = await Promise.all([
      loadImage(imageUrl1),
      loadImage(imageUrl2),
      loadImage(imageUrl3),
    ]);

    const canvas = createCanvas(img1.width * 3, img1.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img1, 0, 0);
    ctx.drawImage(img2, img1.width, 0);
    ctx.drawImage(img3, img1.width * 2, 0);

    const buffer = canvas.toBuffer("image/png");

    const attachment = new AttachmentBuilder(buffer, {
      name: "merged_image.png",
    });

    return attachment;
  } catch (error) {
    logger.error("이미지 병합 중 오류 발생:", error);
    throw error;
  }
}
