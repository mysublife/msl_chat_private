const Connection = require("./connection");
const MessageProcessor = require("../message_processors/message_processor");
const errors = require("../errors");
const messageTemplate = require("../message_template");

module.exports = class ConnectionManager {
  constructor() {
    this._connections = {};
    this._users = {};
    this._nextConnectionId = 0;
    this._messageProcessor = new MessageProcessor();
  }

  newConnection(ws, req) {
    let connectionId = null;

    connectionId = this._storeConnection(ws);

    ws.on("message", (message) => {
      let obj = null;

      // FIXME: Have message throttler per IP

      if (message.length > 100000) {
        // Message too big
        return;
      }

      try {
        obj = JSON.parse(message);
      } catch (e) {
        // Leave, didn't receive JSON
        return;
      }

      try {
        this._messageProcessor.process(obj, connectionId);
      } catch (e) {
        console.log("Failed to process message: " + e.stack);
      }
    });

    ws.on("close", (code, reason) => {
      this._removeConnection(connectionId);
    });

    ws.on("error", (error) => {
      // Error: read ECONNRESET : is due to client leaving chat
      console.log("Received error: " + error);
    });

    this.sendToConnection(messageTemplate.get("signaling_connection_ack"), connectionId);
  }

  sendToConnection(obj, connectionId) {
    if (!this._connections.hasOwnProperty(connectionId)) {
      return;
    }

    try {
      this._connections[connectionId].sendObject(obj);
    } catch (e) {
      if (e === errors.CONNECTION_CLOSED) {
        this._removeConnection(connectionId);
      }
    }
  }

  get connections() {
    return this._connections;
  }

  get users() {
    return this._users;
  }

  _removeConnection(connectionId) {
    if (connectionId !== null && this._connections.hasOwnProperty(connectionId)) {
      if (this._connections[connectionId].userId) {
        this._users[this._connections[connectionId].userId].removeConnectionId(connectionId);
      }
      delete this._connections[connectionId];
    }
  }

  _storeConnection(ws) {
    let connectionId = this._nextConnectionId++;
    this._connections[connectionId] = new Connection(ws, connectionId);
    return connectionId;
  }
}
