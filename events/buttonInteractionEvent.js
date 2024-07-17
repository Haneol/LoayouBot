const fishingView = require("../views/fishingView");

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
    }
  }
}

module.exports = ButtonInteractionEvent;