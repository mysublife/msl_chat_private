const application = require("../application");
const facade = require("../database/facade");
const messageTemplate = require("../message_template");
const validators = require("../utils/validators");

module.exports = class MessageProcessorMessaging {
  process(payload, connectionId) {
    if (!payload.hasOwnProperty("key") || !payload.hasOwnProperty("data")) {
      // Discard payload without key or data
      return;
    }

    switch (payload.key) {
      case "message":
        this._processMessage(payload.data, connectionId)
        break;
    }
  }

  async _processMessage(data, connectionId) {
    // FIXME: Add throttler

    if (!data.hasOwnProperty("target_user_id") ||
        !data.hasOwnProperty("message") ||
        isNaN(data.target_user_id) ||
        data.target_user_id < 1 ||
        !validators.validateMessage(data.message)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_message"), connectionId);
      return;
    }

    let originUser = application.connectionManager.users[application.connectionManager.connections[connectionId].userId];
    if (!originUser) {
      // TODO: internal error
      return;
    }

    if (!originUser.hasContact(data.target_user_id)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_contact"), connectionId);
      return;
    }

    this._sendMessage(data.message, originUser.id, data.target_user_id);
  }

  async _sendMessage(message, originUserId, targetUserId) {
    // Insert in DB
    let result = await facade.messageInsert(message, originUserId, targetUserId);

    // Prepare message to send with data and id
    let message2Send = messageTemplate.get("messaging_message");
    message2Send.payload.data.id = result.insertId;
    message2Send.payload.data.origin_user_id = originUserId;
    message2Send.payload.data.target_user_id = targetUserId;
    message2Send.payload.data.message = message;
    message2Send.payload.data.date_utc = new Date().toISOString(); // Not the exact same time as in DB, but good enough to avoid 2nd query on each insert

    if (application.connectionManager.users.hasOwnProperty(originUserId)) { // Origin user is still connected
      // Send to self (to be visible on all devices)
      let originUserConnectionIds = application.connectionManager.users[originUserId].connectionIds;
      for (let connectionId of originUserConnectionIds) {
        application.connectionManager.sendToConnection(message2Send, connectionId);
      }
    }

    // Send to all target connections
    if (application.connectionManager.users.hasOwnProperty(targetUserId)) { // Target user is connected
      let targetUserConnectionIds = application.connectionManager.users[targetUserId].connectionIds;
      for (let connectionId of targetUserConnectionIds) {
        application.connectionManager.sendToConnection(message2Send, connectionId);
      }
    }
  }
};
