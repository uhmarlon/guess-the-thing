import { Server } from "socket.io";
import JoinHandler from "./joinHandler";

export const setupSocket = (io: Server): void => {
  io.on("connection", (socket) => {
    JoinHandler.bind(socket);
    socket.on("disconnect", () => {
      JoinHandler.disconnect(socket);
    });
  });
};
