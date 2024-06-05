import { Server } from "socket.io";
import JoinHandler from "./joinhandler";
import { AnswerHandler } from "./AnswerHandler";

export class SocketSetup {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public async setup(): Promise<void> {
    this.io.on("connection", (socket) => {
      JoinHandler.bind(socket);
      AnswerHandler.bind(socket);

      socket.on("disconnect", () => {
        JoinHandler.disconnect(socket);
      });

      socket.on("error", (err) => {
        console.error(`Socket error: ${err}`);
      });
    });
  }
}
