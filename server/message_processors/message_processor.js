const MessageProcessorAuth = require("./message_processor_auth");

module.exports = class MessageProcessor {
  constructor() {
    this._messageProcessorAuth = new MessageProcessorAuth();
  }

  process(message, connectionId) {
    if (!message.hasOwnProperty("type") || !message.hasOwnProperty("payload")) {
      // Discard messages without type or payload
      return;
    }

    let messageProcessor;
    switch (message.type) {
      case "auth":
        messageProcessor = this._messageProcessorAuth;
        break;
      default:
        // discard message and leave (otherwise null exception below)
        return;
    }

    messageProcessor.process(message.payload, connectionId);
  }
}
