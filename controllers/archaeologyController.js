const ApiUtil = require("../utils/apiUtil");
const logger = require("../utils/logger");
const archaeologyView = require("../views/archaeologyView");

exports.efficiencyRequest = async (interaction) => {
  await archaeologyView.sendEfficiencyEmbedMsg(interaction);
};

exports.efficiencyCalculate = async (interaction) => {
  const rareArtifactCountInput = interaction.fields.getTextInputValue(
    "archaeology_efficiency_input"
  );
  const uncommonArtifactCountInput = interaction.fields.getTextInputValue(
    "archaeology_efficiency_input2"
  );
  const commonArtifactCountInput = interaction.fields.getTextInputValue(
    "archaeology_efficiency_input3"
  );
  const triumphPercentInput = interaction.fields.getTextInputValue(
    "archaeology_efficiency_input4"
  );
  const costPercentInput = interaction.fields.getTextInputValue(
    "archaeology_efficiency_input5"
  );

  // 입력값을 검증하는 함수
  function isValidInput(input) {
    const num = Number(input);
    return !isNaN(num) && Number.isInteger(num) && num >= 0;
  }

  // percent 처리 함수
  function processPercent(input) {
    if (input.trim() === "") {
      return 0;
    }
    const num = Number(input);
    if (isNaN(num) || num < 0 || num > 100) {
      return 0;
    }
    return num;
  }

  // 모든 입력값 검증
  if (
    !isValidInput(rareArtifactCountInput) ||
    !isValidInput(uncommonArtifactCountInput) ||
    !isValidInput(commonArtifactCountInput)
  ) {
    await archaeologyView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "잘못된 입력입니다. 양의 정수를 입력해주세요."
    );
    return;
  }

  const rareArtifactCount = Number(rareArtifactCountInput);
  const uncommonArtifactCount = Number(uncommonArtifactCountInput);
  const commonArtifactCount = Number(commonArtifactCountInput);
  const triumphPercent = processPercent(triumphPercentInput);
  const costPercent = processPercent(costPercentInput);

  const apiKey = interaction.loayouUser.apiKey;

  const api = new ApiUtil("https://developer-lostark.game.onstove.com", apiKey);

  try {
    const orehaPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 50000,
      ItemGrade: "영웅",
      ItemName: "최상급 오레하 융화 재료",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const rareArtifactPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "희귀",
      ItemName: "오레하 유물",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const uncommonArtifactPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "고급",
      ItemName: "유물",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const commonArtifactPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "일반",
      ItemName: "유물",
      PageNo: 1,
      SortCondition: "DESC",
    });

    // 가격 구하기
    const orehaPrice = Math.floor(orehaPriceData.Items[0].RecentPrice);
    const rareArtifactPrice = Math.floor(
      rareArtifactPriceData.Items[0].RecentPrice
    );
    const uncommonArtifactPrice = Math.floor(
      uncommonArtifactPriceData.Items[0].RecentPrice
    );
    const commonArtifactPrice = Math.floor(
      commonArtifactPriceData.Items[0].RecentPrice
    );

    // 융화재료 묶음 개수
    const orehaBundleCount = Math.min(
      Math.floor(rareArtifactCount / 52),
      Math.floor(uncommonArtifactCount / 51),
      Math.floor(commonArtifactCount / 107)
    );

    const countPerBundle = 15;

    // 융화재료 개수 기대값
    const orehaE =
      countPerBundle * orehaBundleCount * (1 + triumphPercent / 100);
    // 융화재료 개수 최소값
    const orehaM = countPerBundle * orehaBundleCount;

    // 판매 가격 기대값
    const priceE = Math.floor(
      orehaE *
        (orehaPrice * 0.95 - (300 / countPerBundle) * (1 - costPercent / 100))
    );

    // 판매 가격 최소값
    const priceM = Math.floor(
      orehaM *
        (orehaPrice * 0.95 - (300 / countPerBundle) * (1 - costPercent / 100))
    );

    //남은 유물 번들
    const rareRestArtifactBundle = Math.floor(
      (rareArtifactCount - orehaBundleCount * 52) / 100
    );
    const uncommonRestArtifactBundle = Math.floor(
      (uncommonArtifactCount - orehaBundleCount * 51) / 100
    );
    const commonRestArtifactBundle = Math.floor(
      (commonArtifactCount - orehaBundleCount * 107) / 100
    );

    // 나머지 고고학재료 판매 가격
    const priceRestArtifact =
      Math.floor(rareRestArtifactBundle * rareArtifactPrice * 0.95) +
      Math.floor(uncommonRestArtifactBundle * uncommonArtifactPrice * 0.95) +
      Math.floor(commonRestArtifactBundle * commonArtifactPrice * 0.95);

    // 고고학재료만 판매 가격
    const priceArtifact =
      Math.floor(
        Math.floor(rareArtifactCount / 100) * rareArtifactPrice * 0.95
      ) +
      Math.floor(
        Math.floor(uncommonArtifactCount / 100) * uncommonArtifactPrice * 0.95
      ) +
      Math.floor(
        Math.floor(commonArtifactCount / 100) * commonArtifactPrice * 0.95
      );

    // 부족한 재료 구매 후 제작 판매 가격
    const orehaBundleRareArtifact = Math.floor(
      (rareArtifactCount - orehaBundleCount * 52) / 52
    );
    const orehaBundleUncommonArtifact = Math.floor(
      (uncommonArtifactCount - orehaBundleCount * 51) / 51
    );
    const orehaBundleCommonArtifact = Math.floor(
      (commonArtifactCount - orehaBundleCount * 107) / 107
    );

    const maxOrehaBundle = Math.max(
      orehaBundleRareArtifact,
      orehaBundleUncommonArtifact,
      orehaBundleCommonArtifact
    );

    const AdditionalBuyRareArtifact = Math.ceil(
      maxOrehaBundle * 52 - (rareArtifactCount - orehaBundleCount * 52) > 0
        ? (maxOrehaBundle * 52 - (rareArtifactCount - orehaBundleCount * 52)) /
            100
        : 0
    );

    const AdditionalBuyUncommonArtifact = Math.ceil(
      maxOrehaBundle * 51 - (uncommonArtifactCount - orehaBundleCount * 51) > 0
        ? (maxOrehaBundle * 51 -
            (uncommonArtifactCount - orehaBundleCount * 51)) /
            100
        : 0
    );

    const AdditionalBuyCommonArtifact = Math.ceil(
      maxOrehaBundle * 107 - (commonArtifactCount - orehaBundleCount * 107) > 0
        ? (maxOrehaBundle * 107 -
            (commonArtifactCount - orehaBundleCount * 107)) /
            100
        : 0
    );

    const priceAdditionalBuy =
      Math.floor(
        countPerBundle *
          maxOrehaBundle *
          (orehaPrice * 0.95 - (300 / countPerBundle) * (1 - costPercent / 100))
      ) -
      (Math.ceil(AdditionalBuyRareArtifact * rareArtifactPrice) +
        Math.ceil(AdditionalBuyUncommonArtifact * uncommonArtifactPrice) +
        Math.ceil(AdditionalBuyCommonArtifact * commonArtifactPrice));

    const mostEfficientPrice = Math.max(
      priceE + priceRestArtifact,
      priceArtifact,
      priceE + priceAdditionalBuy
    );

    let mostEfficient = [
      0,
      mostEfficientPrice,
      maxOrehaBundle,
      [
        AdditionalBuyRareArtifact,
        AdditionalBuyUncommonArtifact,
        AdditionalBuyCommonArtifact,
      ],
    ];
    if (mostEfficientPrice === priceArtifact) {
      mostEfficient[0] = 1;
    } else if (mostEfficientPrice === priceE + priceRestArtifact) {
      mostEfficient[0] = 0;
    } else {
      mostEfficient[0] = 2;
    }

    await archaeologyView.sendEfficiencyCalculateEmbedMsg(
      interaction,
      rareArtifactCount,
      uncommonArtifactCount,
      commonArtifactCount,
      orehaPrice,
      rareArtifactPrice,
      uncommonArtifactPrice,
      commonArtifactPrice,
      priceE,
      priceM,
      priceRestArtifact,
      priceArtifact,
      priceAdditionalBuy,
      mostEfficient
    );
  } catch (e) {
    logger.error("ERROR calculate archaeology efficiency: ", e);
    await archaeologyView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "고고학 정보를 불러오는데 실패하였습니다."
    );
  }
};
