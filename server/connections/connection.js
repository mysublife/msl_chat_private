const WebSocket = require("ws");
const SizedArray = require("../utils/sized_array");
const errors = require("../errors");

module.exports = class Connection {
  constructor(ws) {
    this._ws = ws;

    this._user = null; // {"id":xxx, "nickname":"xxxx"}
    this._last10MessagesTimeMs = new SizedArray(10);
  }

  sendObject(obj) {
    if (this._ws.readyState !== WebSocket.OPEN) {
      if (this._ws.readyState === WebSocket.CLOSED || this._ws.readyState === WebSocket.CLOSING) {
        throw errors.CONNECTION_CLOSED;
      }
    }

    try {
      this._ws.send(JSON.stringify(obj));
    } catch (e) {
      console.log("Error sending message to connection: " + e.message);
    }
  }

  set user(user) {
    this._user = user;
  }
}
