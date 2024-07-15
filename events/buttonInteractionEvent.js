class ButtonInteractionEvent {
  constructor() {
    if (this.constructor.instance) {
      return this.constructor.instance;
    }
    this.constructor.instance = this;
  }

  async event(interaction) {
    // if (interaction.customId === "open_color_modal") {
    //   await colorController.changeColorRequest(interaction);
    // }
  }
}

module.exports = ButtonInteractionEvent;
