const application = require("../application");
const facade = require("../database/facade");
const messageTemplate = require("../message_template");

module.exports = class MessageProcessorSignaling {
  process(payload, connectionId) {
    if (!payload.hasOwnProperty("key") || !payload.hasOwnProperty("data")) {
      // Discard payload without key or data
      return;
    }

    switch (payload.key) {
      case "message_read":
        this._processMessageRead(payload.data, connectionId)
        break;
    }
  }

  async _processMessageRead(data, connectionId) {
    // FIXME: Add throttler

    if (!data.hasOwnProperty("last_message_id") ||
        isNaN(data.last_message_id) ||
        data.last_message_id < 1) {
      application.connectionManager.sendToConnection(messageTemplate.get("signaling_error_invalid_last_message_id"), connectionId);
      return;
    }

    let user = application.connectionManager.users[application.connectionManager.connections[connectionId].userId];
    if (!user) {
      // TODO: internal error
      return;
    }

    let message = await facade.messageGet(data.last_message_id);

    await facade.messageUpdateDateRead(data.last_message_id, message.user_origin, user.id); // target is origin, user is marking as "read" the messages he is the target

    // FIXME: Send message read to user other connections
    let message2Send = messageTemplate.get("signaling_message_read");
    //message2Send...
    //message2Send

    let userConnectionIds = user.connectionIds;
    for (let connectionId of userConnectionIds) {
      application.connectionManager.sendToConnection(message2Send, connectionId);
    }
  }
};
