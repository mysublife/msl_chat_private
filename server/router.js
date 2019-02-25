const application = require("./application");
const facade = require("./database/facade");
const messageTemplate = require("./message_template");

module.exports.sendContactListToConnection = async function(connectionId) {
  let user = application.connectionManager.getConnection(connectionId).user;

  if (!user) {
    console.log("Attempted to send contact list to non signed-in connection.")
    return;
  }

  let message = messageTemplate.get("status_contact_list");
  message.payload.data = await facade.contactListGet(user.id);
  application.connectionManager.sendToConnection(message, connectionId);
};
