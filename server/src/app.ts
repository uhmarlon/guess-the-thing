import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocket } from "./network/socketHandlers";
import { serverConfig } from "./config/serverConfig";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, serverConfig.socketIOOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSocket(io);
server.listen(serverConfig.port, () => {
  console.log(`Server läuft auf Port ${serverConfig.port}`);
});

export { app, server, io };
