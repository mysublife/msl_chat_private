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
    if (!data.hasOwnProperty("username") ||
        !data.hasOwnProperty("session_key") ||
        !validators.validateEmail(data.username) ||
        !validators.validateSessionKey(data.session_key)) {
      application.connectionManager.sendToConnection(messageTemplate.get("auth_error_missing_credentials"), connectionId);
      return;
    }

    // Get user
    let user = await facade.userGet(data.username, data.session_key);
    if (!user) {
      application.connectionManager.sendToConnection(messageTemplate.get("auth_error_invalid_credentials"), connectionId);
      return;
    }

    application.connectionManager.sendToConnection(messageTemplate.get("signaling_signin_success"), connectionId);

    // Load contact list
    if (!application.connectionManager.users.hasOwnProperty(user.id)) {
      application.connectionManager.users[user.id] = new User(user.id, user.name);
      await application.connectionManager.users[user.id].loadContactList();
    }

    // Store connection and user references in objects
    application.connectionManager.connections[connectionId].userId = user.id;
    application.connectionManager.users[user.id].addConnectionId(connectionId);

    this._sendContactList(user.id, connectionId);
    this._sendUnreadMessages(user.id, connectionId);
  }

  _sendContactList(userId, connectionId) {
    let message = messageTemplate.get("status_contact_list");
    message.payload.data = application.connectionManager.users[userId].contactList;
    application.connectionManager.sendToConnection(message, connectionId);
  }

  async _sendUnreadMessages(userId, connectionId) {
    let messagesUnread = await facade.messageGetUnread(userId);
    for (let i = 0; i < messagesUnread.length; ++i) {
      let message = messageTemplate.get("messaging_message");
      message.payload.data = messagesUnread[i];
      application.connectionManager.sendToConnection(message, connectionId);
    }
  }
}
