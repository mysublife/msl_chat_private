const application = require("../application");
const messageTemplate = require("../message_template");
const utils = require("../utils/utils");

module.exports = class HTTPRouter {
  constructor() {
    this._allowedHTTPRequestOrigin = process.env.ALLOWED_HTTP_REQUEST_ORIGIN.split(",");
  }

  process(req, res) {
    if (!this._allowedHTTPRequestOrigin.includes(utils.getClientIp(req))) {
      res.writeHead(404);
      res.end();
      return;
    }

    let url = new URL("https://" + req.headers.host + req.url);
    if (url.searchParams.get("http_request_key") !== process.env.HTTP_REQUEST_KEY) {
      res.writeHead(401);
      res.end();
      return;
    }

    switch (url.pathname) {
      case "/contact_list_update":
        this._processContactListUpdate(url, res);
        break;
    }
  }

  async _processContactListUpdate(url, res) {
    let userId = url.searchParams.get("user_id");
    if (!userId || isNaN(userId)) {
      res.writeHead(422);
      res.end();
      return;
    }

    userId = Number.parseInt(userId);

    if (application.connectionManager.users.hasOwnProperty(userId)) {
      await application.connectionManager.users[userId].loadContactList();

      let connectionIds = application.connectionManager.users[userId].connectionIds;
      for (let connectionId of connectionIds) {
        let message = messageTemplate.get("status_contact_list");
        message.payload.data = application.connectionManager.users[userId].contactList;
        application.connectionManager.sendToConnection(message, connectionId);
      }
    }

    res.writeHead(200);
    res.end();
  }
};
