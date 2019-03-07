require("dotenv").config();

const WebSocket = require("ws");
const ServerFactory = require("./server_factory");
const ConnectionManager = require("./connections/connection_manager");

console.log("Starting application");

const app = new ServerFactory().createServer(process.env.SECURE === "true");
// passing a reference to web server so WS would knew port and SSL capabilities
const wss = new WebSocket.Server({ server: app });

const connectionManager = new ConnectionManager();

wss.on("connection", (ws, req) => {
  try {
    connectionManager.newConnection(ws, req);
  } catch (e) {
    console.log("Application would have crashed: " + e.stack);
  }
});

module.exports.connectionManager = connectionManager;
