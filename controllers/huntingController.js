const ApiUtil = require("../utils/apiUtil");
const logger = require("../utils/logger");
const huntingView = require("../views/huntingView");

exports.efficiencyRequest = async (interaction) => {
  await huntingView.sendEfficiencyEmbedMsg(interaction);
};

exports.efficiencyCalculate = async (interaction) => {
  const rareMeatCountInput = interaction.fields.getTextInputValue(
    "hunting_efficiency_input"
  );
  const uncommonMeatCountInput = interaction.fields.getTextInputValue(
    "hunting_efficiency_input2"
  );
  const commonMeatCountInput = interaction.fields.getTextInputValue(
    "hunting_efficiency_input3"
  );
  const triumphPercentInput = interaction.fields.getTextInputValue(
    "hunting_efficiency_input4"
  );
  const costPercentInput = interaction.fields.getTextInputValue(
    "hunting_efficiency_input5"
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
    !isValidInput(rareMeatCountInput) ||
    !isValidInput(uncommonMeatCountInput) ||
    !isValidInput(commonMeatCountInput)
  ) {
    await huntingView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "잘못된 입력입니다. 양의 정수를 입력해주세요."
    );
    return;
  }

  const rareMeatCount = Number(rareMeatCountInput);
  const uncommonMeatCount = Number(uncommonMeatCountInput);
  const commonMeatCount = Number(commonMeatCountInput);
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

    const rareMeatPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "희귀",
      ItemName: "오레하 두툼한 생고기",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const uncommonMeatPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "고급",
      ItemName: "생고기",
      PageNo: 1,
      SortCondition: "DESC",
    });

    const commonMeatPriceData = await api.post("/markets/items", {
      Sort: "RECENT_PRICE",
      CharacterClass: "아르카나",
      CategoryCode: 90000,
      ItemGrade: "일반",
      ItemName: "생고기",
      PageNo: 1,
      SortCondition: "DESC",
    });

    // 가격 구하기
    const orehaPrice = Math.floor(orehaPriceData.Items[0].RecentPrice);
    const rareMeatPrice = Math.floor(rareMeatPriceData.Items[0].RecentPrice);
    const uncommonMeatPrice = Math.floor(
      uncommonMeatPriceData.Items[0].RecentPrice
    );
    const commonMeatPrice = Math.floor(
      commonMeatPriceData.Items[0].RecentPrice
    );

    // 융화재료 묶음 개수
    const orehaBundleCount = Math.min(
      Math.floor(rareMeatCount / 52),
      Math.floor(uncommonMeatCount / 69),
      Math.floor(commonMeatCount / 142)
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

    //남은 생고기 번들
    const rareRestMeatBundle = Math.floor(
      (rareMeatCount - orehaBundleCount * 52) / 100
    );
    const uncommonRestMeatBundle = Math.floor(
      (uncommonMeatCount - orehaBundleCount * 69) / 100
    );
    const commonRestMeatBundle = Math.floor(
      (commonMeatCount - orehaBundleCount * 142) / 100
    );

    // 나머지 수렵재료 판매 가격
    const priceRestMeat =
      Math.floor(rareRestMeatBundle * rareMeatPrice * 0.95) +
      Math.floor(uncommonRestMeatBundle * uncommonMeatPrice * 0.95) +
      Math.floor(commonRestMeatBundle * commonMeatPrice * 0.95);

    // 수렵재료만 판매 가격
    const priceMeat =
      Math.floor(Math.floor(rareMeatCount / 100) * rareMeatPrice * 0.95) +
      Math.floor(
        Math.floor(uncommonMeatCount / 100) * uncommonMeatPrice * 0.95
      ) +
      Math.floor(Math.floor(commonMeatCount / 100) * commonMeatPrice * 0.95);

    // 부족한 재료 구매 후 제작 판매 가격
    const orehaBundleRareMeat = Math.floor(
      (rareMeatCount - orehaBundleCount * 52) / 52
    );
    const orehaBundleUncommonMeat = Math.floor(
      (uncommonMeatCount - orehaBundleCount * 69) / 69
    );
    const orehaBundleCommonMeat = Math.floor(
      (commonMeatCount - orehaBundleCount * 142) / 142
    );

    const maxOrehaBundle = Math.max(
      orehaBundleRareMeat,
      orehaBundleUncommonMeat,
      orehaBundleCommonMeat
    );

    const AdditionalBuyRareMeat = Math.ceil(
      maxOrehaBundle * 52 - (rareMeatCount - orehaBundleCount * 52) > 0
        ? (maxOrehaBundle * 52 - (rareMeatCount - orehaBundleCount * 52)) / 100
        : 0
    );

    const AdditionalBuyUncommonMeat = Math.ceil(
      maxOrehaBundle * 69 - (uncommonMeatCount - orehaBundleCount * 69) > 0
        ? (maxOrehaBundle * 69 - (uncommonMeatCount - orehaBundleCount * 69)) /
            100
        : 0
    );

    const AdditionalBuyCommonMeat = Math.ceil(
      maxOrehaBundle * 142 - (commonMeatCount - orehaBundleCount * 142) > 0
        ? (maxOrehaBundle * 142 - (commonMeatCount - orehaBundleCount * 142)) /
            100
        : 0
    );

    const priceAdditionalBuy =
      Math.floor(
        countPerBundle *
          maxOrehaBundle *
          (orehaPrice * 0.95 - (300 / countPerBundle) * (1 - costPercent / 100))
      ) -
      (Math.ceil(AdditionalBuyRareMeat * rareMeatPrice) +
        Math.ceil(AdditionalBuyUncommonMeat * uncommonMeatPrice) +
        Math.ceil(AdditionalBuyCommonMeat * commonMeatPrice));

    const mostEfficientPrice = Math.max(
      priceE + priceRestMeat,
      priceMeat,
      priceE + priceAdditionalBuy
    );

    let mostEfficient = [
      0,
      mostEfficientPrice,
      maxOrehaBundle,
      [
        AdditionalBuyRareMeat,
        AdditionalBuyUncommonMeat,
        AdditionalBuyCommonMeat,
      ],
    ];
    if (mostEfficientPrice === priceMeat) {
      mostEfficient[0] = 1;
    } else if (mostEfficientPrice === priceE + priceRestMeat) {
      mostEfficient[0] = 0;
    } else {
      mostEfficient[0] = 2;
    }

    await huntingView.sendEfficiencyCalculateEmbedMsg(
      interaction,
      rareMeatCount,
      uncommonMeatCount,
      commonMeatCount,
      orehaPrice,
      rareMeatPrice,
      uncommonMeatPrice,
      commonMeatPrice,
      priceE,
      priceM,
      priceRestMeat,
      priceMeat,
      priceAdditionalBuy,
      mostEfficient
    );
  } catch (e) {
    logger.error("ERROR calculate hunting efficiency: ", e);
    await huntingView.sendEfficiencyCalculateFailEmbedMsg(
      interaction,
      "수렵 정보를 불러오는데 실패하였습니다."
    );
  }
};
