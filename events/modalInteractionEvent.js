const userController = require("../controllers/userController");
const fishingController = require("../controllers/fishingController");
const huntingController = require("../controllers/huntingController");

class ModalInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "set_api_key") {
      await userController.setApiKey(interaction);
    } else if (interaction.customId === "fishing_efficiency") {
      await fishingController.efficiencyCalculate(interaction);
    } else if (interaction.customId === "hunting_efficiency") {
      await huntingController.efficiencyCalculate(interaction);
    }
  }
}

module.exports = ModalInteractionEvent;
