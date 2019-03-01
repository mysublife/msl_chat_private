const MessageProcessorAuth = require("./message_processor_auth");
const MessageProcessorMessaging = require("./message_processor_messaging");

module.exports = class MessageProcessor {
  constructor() {
    this._messageProcessorAuth = new MessageProcessorAuth();
    this._messageProcessorMessaging = new MessageProcessorMessaging();
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
      case "message":
        messageProcessor = this._messageProcessorMessaging;
        break;
      default:
        // discard message and leave (otherwise null exception below)
        return;
    }

    messageProcessor.process(message.payload, connectionId);
  }
}
