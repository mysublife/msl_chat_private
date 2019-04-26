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
      case "get_conversation":
        this._processGetConversation(payload.data, connectionId);
        break;
    }
  }

  _processMessage(data, connectionId) {
    if (!data.hasOwnProperty("user_target_id") ||
        !data.hasOwnProperty("message") ||
        isNaN(data.user_target_id) ||
        data.user_target_id < 1 ||
        !validators.validateMessage(data.message)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_message"), connectionId);
      return;
    }

    let userOrigin = application.connectionManager.users[application.connectionManager.connections[connectionId].userId];
    if (!userOrigin) {
      // TODO: internal error
      return;
    }

    if (!userOrigin.hasContact(data.user_target_id)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_contact"), connectionId);
      return;
    }

    this._sendMessage(data.message, userOrigin.id, data.user_target_id);
  }

  async _sendMessage(message, userOriginId, userTargetId) {
    // Insert in DB
    let result = await facade.messageInsert(message, userOriginId, userTargetId);

    // Prepare message to send with data and id
    let message2Send = messageTemplate.get("messaging_message");
    message2Send.payload.data.id = result.insertId;
    message2Send.payload.data.user_origin_id = userOriginId;
    message2Send.payload.data.user_target_id = userTargetId;
    message2Send.payload.data.message = message;
    message2Send.payload.data.date_sent_utc = new Date().toISOString(); // Not the exact same time as in DB, but good enough to avoid 2nd query on each insert

    if (application.connectionManager.users.hasOwnProperty(userOriginId)) { // Origin user is still connected
      // Send to self (to be visible on all devices)
      let userOriginConnectionIds = application.connectionManager.users[userOriginId].connectionIds;
      for (let connectionId of userOriginConnectionIds) {
        application.connectionManager.sendToConnection(message2Send, connectionId);
      }
    }

    // Send to all target connections
    if (application.connectionManager.users.hasOwnProperty(userTargetId)) { // Target user is connected
      let userTargetConnectionIds = application.connectionManager.users[userTargetId].connectionIds;
      for (let connectionId of userTargetConnectionIds) {
        application.connectionManager.sendToConnection(message2Send, connectionId);
      }
    }
  }

  async _processGetConversation(data, connectionId) {
    if (!data.hasOwnProperty("user_target_id") ||
        !data.hasOwnProperty("before_message_id") ||
        isNaN(data.user_target_id) ||
        data.user_target_id < 1 ||
        (data.before_message_id !== null && (isNaN(data.before_message_id) || data.before_message_id < 1))) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_get_conversation"), connectionId);
      return;
    }

    let user = application.connectionManager.users[application.connectionManager.connections[connectionId].userId];
    if (!user) {
      // TODO: internal error
      return;
    }

    if (!user.hasContact(data.user_target_id)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_error_invalid_contact"), connectionId);
      return;
    }

    let message = messageTemplate.get("messaging_conversation");
    message.payload.data.messages = await facade.messageGetConversation(user.id, data.user_target_id, data.before_message_id);
    message.payload.data.user_target_id = data.user_target_id;
    application.connectionManager.sendToConnection(message, connectionId);
  }
};
