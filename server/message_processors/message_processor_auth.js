const validators = require("../utils/validators");
const facade = require("../database/facade")

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
      return;
    }

    console.log(await facade.userGet(data.username, data.session_key));
  }
}
