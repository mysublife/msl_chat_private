const WebSocket = require("ws");
const SizedArray = require("../utils/sized_array");
const errors = require("../errors");

module.exports = class Connection {
  constructor(ws) {
    this._ws = ws;

    this._userId = null;

    this._last10MessagesTimeMs = new SizedArray(10);
  }

  // Use connectionManager instead, so it removes connection if not available
  sendObject(obj) {
    if (this._ws.readyState !== WebSocket.OPEN) {
      if (this._ws.readyState === WebSocket.CLOSED || this._ws.readyState === WebSocket.CLOSING) {
        throw errors.CONNECTION_CLOSED;
      }
    }

    this._ws.send(JSON.stringify(obj), (err) => {
      if (err && err.message) {
        console.log("Error sending message to connection: " + err.message);
      }
    });
  }

  set userId(userId) {
    this._userId = userId;
  }

  get userId() {
    return this._userId;
  }
}
