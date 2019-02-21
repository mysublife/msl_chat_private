const fs = require('fs');

module.exports.createServer = function(secure) {
  return (secure) ? createServerSecure() : createServerUnsecure();
};

// dummy request processing
var processRequest = function (req, res) {
  res.writeHead(404);
  res.end();
};

var createServerSecure = function() {
  var httpServ = require('https');

  var app = httpServ.createServer({
    key: fs.readFileSync(process.env.PATH_TO_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CRT)
  }, processRequest).listen(process.env.PORT);

  var timeout;
  fs.watch(process.env.PATH_TO_CRT, () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        app._sharedCreds.context.setCert(fs.readFileSync(process.env.PATH_TO_CRT));
        app._sharedCreds.context.setKey(fs.readFileSync(process.env.PATH_TO_KEY));
    }, 1000);
  });

  console.log("App created");

  return app;
};

var createServerUnsecure = function() {
  var httpServ = require('http');

  return httpServ.createServer(processRequest).listen(process.env.PORT);
}
