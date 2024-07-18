const logger = require("../utils/logger");
const calculateView = require("../views/calculatorView");

exports.sendMoneyCalculatorRequest = async (interaction) => {
  const price = interaction.options.getInteger("가격");

  await calculateView.sendMoneyCalculatorEmbedMsg(
    interaction,
    Math.ceil((price * 100) / 95)
  );
};

exports.auctionCalculatorRequest = async (interaction) => {
  const auctionPrice = interaction.options.getInteger("가격");

  await calculateView.sendAuctionCalculatorEmbedMsg(
    interaction,
    auctionPrice,
    calculateAuctionPrice(auctionPrice, 8)
  );
};

exports.auctionCalculatorModifyRequest = async (interaction) => {
  const selectedValue = interaction.values[0];
  const description = interaction.message.embeds[0].description;
  const match = description.match(/\*\*\*(\d+)\*\*\*/);
  const auctionPrice = Number(match[1]);

  let calculateVal;
  let defaultVal;
  if (selectedValue === "people4") {
    calculateVal = calculateAuctionPrice(auctionPrice, 4);
    defaultVal = [true, false, false];
  } else if (selectedValue === "people16") {
    calculateVal = calculateAuctionPrice(auctionPrice, 16);
    defaultVal = [false, false, true];
  } else {
    calculateVal = calculateAuctionPrice(auctionPrice, 8);
    defaultVal = [false, true, false];
  }

  await calculateView.updateAuctionCalculatorEmbedMsg(
    interaction,
    auctionPrice,
    calculateVal,
    defaultVal
  );
};

function calculateAuctionPrice(auctionPrice, x) {
  const people = Math.floor((auctionPrice * (x - 1)) / x);
  const peopleDivide = Math.floor(people / (x - 1));
  const peopleSellMin = Math.floor(
    (((auctionPrice * 0.95 * (x - 1)) / x) * 10) / 11
  );
  const peopleSellMinDivide = Math.floor(peopleSellMin / (x - 1));
  const peopleSellMinMargin = Math.floor((auctionPrice - peopleSellMin) * 0.95);
  const peopleSellMax = Math.floor((auctionPrice * 0.95 * (x - 1)) / x);
  const peopleSellMaxDivide = Math.floor(peopleSellMax / (x - 1));
  const peopleSellMaxMargin = Math.floor((auctionPrice - peopleSellMax) * 0.95);

  return [
    [people, peopleDivide],
    [peopleSellMin, peopleSellMinDivide, peopleSellMinMargin],
    [peopleSellMax, peopleSellMaxDivide, peopleSellMaxMargin],
  ];
}
