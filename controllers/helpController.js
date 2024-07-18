const helpView = require("../views/helpView");

exports.help = async (msg) => {
  await helpView.sendHelpEmbededMsg(msg);
};
