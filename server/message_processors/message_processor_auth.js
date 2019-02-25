const application = require("../application");
const validators = require("../utils/validators");
const facade = require("../database/facade")
const messageTemplate = require("../message_template");
const router = require("../router");

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
    let connection = application.connectionManager.getConnection(connectionId);

    connection.user = user;

    if (!user) {
      application.connectionManager.sendToConnection(messageTemplate.get("auth_invalid_credentials"), connectionId);
      return;
    }

    router.sendContactListToConnection(connectionId);
  }
}
