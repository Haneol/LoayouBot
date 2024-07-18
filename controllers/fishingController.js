const ApiUtil = require("../utils/apiUtil");
const logger = require("../utils/logger");
const fishingView = require("../views/fishingView");

exports.efficiencyRequest = async (interaction) => {
  await fishingView.sendEfficiencyEmbedMsg(interaction);
};

exports.efficiencyCalculate = async (interaction) => {
  const rareFishCountInput = interaction.fields.getTextInputValue(
    "fishing_efficiency_input"
  );
  const uncommonFishCountInput = interaction.fields.getTextInputValue(
    "fishing_efficiency_input2"
  );
  const commonFishCountInput = interaction.fields.getTextInputValue(
    "fishing_efficiency_input3"
  );
  const triumphPercentInput = interaction.fields.getTextInputValue(
    "fishing_efficiency_input4"
  );
  const costPercentInput = interaction.fields.getTextInputValue(
    "fishing_efficiency_input5"
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
    !isValidInput(rareFishCountInput) ||
    !isValidInput(uncommonFishCountInput) ||
    !isValidInput(commonFishCountInput)
  ) {
    await fishingView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "잘못된 입력입니다. 양의 정수를 입력해주세요."
    );
    return;
  }

  const rareFishCount = Number(rareFishCountInput);
  const uncommonFishCount = Number(uncommonFishCountInput);
  const commonFishCount = Number(commonFishCountInput);
  const triumphPercent = processPercent(triumphPercentInput);
  const costPercent = processPercent(costPercentInput);

  const apiKey = interaction.loayouUser.apiKey;

  const api = new ApiUtil("https://developer-lostark.game.onstove.com", apiKey);

  try {
    //const orehaPriceData = await api.get("/markets/items/6861011"); // 최상급 오레하
    //const rareFishPriceData = await api.get("/markets/items/6885608"); // 오레하 태양 잉어
    //const uncommonFishPriceData = await api.get("/markets/items/6882604"); // 오레하 태양 잉어
    //const commonFishPriceData = await api.get("/markets/items/6882601"); // 오레하 태양 잉어

    const orehaPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 50000,
      ItemGrade: "영웅",
      ItemName: "최상급 오레하 융화 재료",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const rareFishPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "희귀",
      ItemName: "오레하 태양 잉어",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const uncommonFishPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "고급",
      ItemName: "생선",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const commonFishPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "일반",
      ItemName: "생선",
      PageNo: 1,
      SortCondition: "DESC",
    });

    // 가격 구하기
    const orehaPrice = Math.floor(orehaPriceData.Items[0].RecentPrice);
    const rareFishPrice = Math.floor(rareFishPriceData.Items[0].RecentPrice);
    const uncommonFishPrice = Math.floor(
      uncommonFishPriceData.Items[0].RecentPrice
    );
    const commonFishPrice = Math.floor(
      commonFishPriceData.Items[0].RecentPrice
    );

    // 융화재료 묶음 개수
    const orehaBundleCount = Math.min(
      Math.floor(rareFishCount / 52),
      Math.floor(uncommonFishCount / 69),
      Math.floor(commonFishCount / 142)
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

    //남은 생선 번들
    const rareRestFishBundle = Math.floor(
      (rareFishCount - orehaBundleCount * 52) / 100
    );
    const uncommonRestFishBundle = Math.floor(
      (uncommonFishCount - orehaBundleCount * 69) / 100
    );
    const commonRestFishBundle = Math.floor(
      (commonFishCount - orehaBundleCount * 142) / 100
    );

    // 나머지 낚시재료 판매 가격
    const priceRestFish =
      Math.floor(rareRestFishBundle * rareFishPrice * 0.95) +
      Math.floor(uncommonRestFishBundle * uncommonFishPrice * 0.95) +
      Math.floor(commonRestFishBundle * commonFishPrice * 0.95);

    // 낚시재료만 판매 가격
    const priceFish =
      Math.floor(Math.floor(rareFishCount / 100) * rareFishPrice * 0.95) +
      Math.floor(
        Math.floor(uncommonFishCount / 100) * uncommonFishPrice * 0.95
      ) +
      Math.floor(Math.floor(commonFishCount / 100) * commonFishPrice * 0.95);

    // 부족한 재료 구매 후 제작 판매 가격
    const orehaBundleRareFish = Math.floor(
      (rareFishCount - orehaBundleCount * 52) / 52
    );
    const orehaBundleUncommonFish = Math.floor(
      (uncommonFishCount - orehaBundleCount * 69) / 69
    );
    const orehaBundleCommonFish = Math.floor(
      (commonFishCount - orehaBundleCount * 142) / 142
    );

    const maxOrehaBundle = Math.max(
      orehaBundleRareFish,
      orehaBundleUncommonFish,
      orehaBundleCommonFish
    );

    const AdditionalBuyRarefish = Math.ceil(
      maxOrehaBundle * 52 - (rareFishCount - orehaBundleCount * 52) > 0
        ? (maxOrehaBundle * 52 - (rareFishCount - orehaBundleCount * 52)) / 100
        : 0
    );

    const AdditionalBuyUncommonfish = Math.ceil(
      maxOrehaBundle * 69 - (uncommonFishCount - orehaBundleCount * 69) > 0
        ? (maxOrehaBundle * 69 - (uncommonFishCount - orehaBundleCount * 69)) /
            100
        : 0
    );

    const AdditionalBuyCommonfish = Math.ceil(
      maxOrehaBundle * 142 - (commonFishCount - orehaBundleCount * 142) > 0
        ? (maxOrehaBundle * 142 - (commonFishCount - orehaBundleCount * 142)) /
            100
        : 0
    );

    const priceAdditionalBuy =
      Math.floor(
        countPerBundle *
          maxOrehaBundle *
          (orehaPrice * 0.95 - (300 / countPerBundle) * (1 - costPercent / 100))
      ) -
      (Math.ceil(AdditionalBuyRarefish * rareFishPrice) +
        Math.ceil(AdditionalBuyUncommonfish * uncommonFishPrice) +
        Math.ceil(AdditionalBuyCommonfish * commonFishPrice));

    const mostEfficientPrice = Math.max(
      priceE + priceRestFish,
      priceFish,
      priceE + priceAdditionalBuy
    );

    let mostEfficient = [
      0,
      mostEfficientPrice,
      maxOrehaBundle,
      [
        AdditionalBuyRarefish,
        AdditionalBuyUncommonfish,
        AdditionalBuyCommonfish,
      ],
    ];
    if (mostEfficientPrice === priceFish) {
      mostEfficient[0] = 1;
    } else if (mostEfficientPrice === priceE + priceRestFish) {
      mostEfficient[0] = 0;
    } else {
      mostEfficient[0] = 2;
    }

    await fishingView.sendEfficiencyCalculateEmbedMsg(
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
    );
  } catch (e) {
    logger.error("ERROR calculate fishing efficiency: ", e);
    await fishingView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "낚시 정보를 불러오는데 실패하였습니다."
    );
  }
};
