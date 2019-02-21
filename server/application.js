require("dotenv").config();

const WebSocket = require('ws');
const serverFactory = require('./server_factory');

const app = serverFactory.createServer(process.env.SECURE === "true");
// passing a reference to web server so WS would knew port and SSL capabilities
const wss = new WebSocket.Server({ server: app });

wss.on('connection', function connection(ws, req) {
  //TODO: Process new connection
  console.log("connection in");
  //connectionManager.processNewConnection(ws, req);
});
