const MessageProcessorAuth = require("./message_processor_auth");
const MessageProcessorMessaging = require("./message_processor_messaging");
const MessageProcessorSignaling = require("./message_processor_signaling");

module.exports = class MessageProcessor {
  constructor() {
    this._messageProcessorAuth = new MessageProcessorAuth();
    this._messageProcessorMessaging = new MessageProcessorMessaging();
    this._messageProcessorSignaling = new MessageProcessorSignaling();
  }

  process(message, connectionId) {
    if (!message.hasOwnProperty("type") || !message.hasOwnProperty("payload")) {
      // Discard messages without type or payload
      return;
    }

    // FIXME: Add overall throttler (i.e 10 auth, 10 messaging, 100 signaling...)

    let messageProcessor;
    switch (message.type) {
      case "auth":
        messageProcessor = this._messageProcessorAuth;
        break;
      case "messaging":
        messageProcessor = this._messageProcessorMessaging;
        break;
      case "signaling":
        messageProcessor = this._messageProcessorSignaling;
        break;
      default:
        // discard message and leave (otherwise null exception below)
        return;
    }

    messageProcessor.process(message.payload, connectionId);
  }
}
