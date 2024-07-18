const calculateController = require("../controllers/calculatorController");

class SelectMenuInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "auction_calculator") {
      await calculateController.auctionCalculatorModifyRequest(interaction);
    }
  }
}

module.exports = SelectMenuInteractionEvent;
