const fs = require('fs');

module.exports = class ServerFactory {
  createServer(secure) {
    if (secure) {
      return this._createServerSecure();
    } else {
      return this._createServerUnsecure();
    }
  }

  _createServerSecure() {
    var httpServ = require('https');

    var app = httpServ.createServer({
      key: fs.readFileSync(process.env.PATH_TO_KEY),
      cert: fs.readFileSync(process.env.PATH_TO_CRT)
    }, this._processRequest).listen(process.env.PORT);

    var timeout;
    fs.watch(process.env.PATH_TO_CRT, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          app._sharedCreds.context.setCert(fs.readFileSync(process.env.PATH_TO_CRT));
          app._sharedCreds.context.setKey(fs.readFileSync(process.env.PATH_TO_KEY));
      }, 1000);
    });

    return app;
  }

  _createServerUnsecure() {
    var httpServ = require('http');

    return httpServ.createServer(this._processRequest).listen(process.env.PORT);
  }

  // FIXME: Keep dummy processing, but have also a request processing for contaclist changes
  // dummy request processing
  _processRequest(req, res) {
    res.writeHead(404);
    res.end();
  }
}
