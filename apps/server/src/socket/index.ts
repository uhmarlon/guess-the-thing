import { Server } from "socket.io";
import JoinHandler from "./joinhandler";

export const setupSocket = (io: Server): void => {
  io.on("connection", (socket) => {
    JoinHandler.bind(socket);
  });
  io.on("disconnect", (socket) => {
    JoinHandler.disconnect(socket);
  });
};
