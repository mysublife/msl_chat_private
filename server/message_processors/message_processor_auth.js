const application = require("../application");
const validators = require("../utils/validators");
const facade = require("../database/facade");
const messageTemplate = require("../message_template");
const User = require("../connections/user");

module.exports = class MessageProcessorAuth {
  process(payload, connectionId) {
    if (!payload.hasOwnProperty("key") || !payload.hasOwnProperty("data")) {
      // Discard payload without key or data
      return;
    }

    switch (payload.key) {
      case "signin":
        this._processSignin(payload.data, connectionId)
        break;
    }
  }

  async _processSignin(data, connectionId) {
    // FIXME: Add throttler

    if (!data.hasOwnProperty("username") ||
        !data.hasOwnProperty("session_key") ||
        !validators.validateEmail(data.username) ||
        !validators.validateSessionKey(data.session_key)) {
      application.connectionManager.sendToConnection(messageTemplate.get("auth_missing_credentials"), connectionId);
      return;
    }

    let user = await facade.userGet(data.username, data.session_key);
    if (!user) {
      application.connectionManager.sendToConnection(messageTemplate.get("auth_invalid_credentials"), connectionId);
      return;
    }

    if (!application.connectionManager.users.hasOwnProperty(user.id)) {
      application.connectionManager.users[user.id] = new User(user.id, user.name);
      await application.connectionManager.users[user.id].loadContactList();
    }
    application.connectionManager.connections[connectionId].userId = user.id;
    application.connectionManager.users[user.id].addConnectionId(connectionId);

    let message = messageTemplate.get("status_contact_list");
    message.payload.data = application.connectionManager.users[user.id].contactList;
    application.connectionManager.sendToConnection(message, connectionId);
  }
}
