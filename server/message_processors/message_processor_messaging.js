const application = require("../application");
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

  async _processSignin(data, connectionId) {
    // FIXME: Add throttler

    if (!data.hasOwnProperty("target_user_id") ||
        !data.hasOwnProperty("message") ||
        !isNaN(data.target_user_id) ||
        data.target_user_id < 1 ||
        !validators.validateMessage(data.message)) {
      application.connectionManager.sendToConnection(messageTemplate.get("messaging_invalid_message"), connectionId);
      return;
    }

    let originUser = application.connectionManager.users[application.connectionManager.connections[connectionId].userId];
    // FIXME: Check if user has target in his contact list
  }
};
