const fishingView = require("../views/fishingView");
const huntingView = require("../views/huntingView");
const archaeologyView = require("../views/archaeologyView");

class ButtonInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "fishing_efficiency_3tier") {
      await fishingView.sendEfficiencyInputModal(interaction);
    } else if (interaction.customId === "hunting_efficiency_3tier") {
      await huntingView.sendEfficiencyInputModal(interaction);
    } else if (interaction.customId === "archaeology_efficiency_3tier") {
      await archaeologyView.sendEfficiencyInputModal(interaction);
    }
  }
}

module.exports = ButtonInteractionEvent;
