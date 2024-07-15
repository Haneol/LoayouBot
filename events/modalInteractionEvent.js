const userController = require("../controllers/userController");

class ModalInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    if (interaction.customId === "set_api_key") {
      console.log("eee");
      await userController.setApiKey(interaction);
    }
  }
}

module.exports = ModalInteractionEvent;
