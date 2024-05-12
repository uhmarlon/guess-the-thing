import { Server } from "socket.io";
import JoinHandler from "./joinHandler";
import { AnswerHandler } from "./AnswerHandler";

export class SocketSetup {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public async setup(): Promise<void> {
    this.io.on("connection", async (socket) => {
      JoinHandler.bind(socket);

      AnswerHandler.bind(socket);

      socket.on("disconnect", async () => {
        JoinHandler.disconnect(socket);
      });
    });
  }
}
