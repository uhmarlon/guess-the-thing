import createFastify from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import index from "./api/player/level";
import { apiindex } from "./api/index";
import join from "./api/game/join";
import bugtracker from "./api/bugtracker";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3005;
const server = createFastify();

server.register(cors, {
  origin: "https://guessthething.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

const io: Server = new Server(server.server, {
  cors: {
    origin: "https://guessthething.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
  },
});

export { io };
import { SocketSetup } from "./socket";

const socketSetup = new SocketSetup(io);
socketSetup.setup();

server.register(index);
server.register(join);
server.register(bugtracker);
server.register(apiindex);

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: PORT as number, host: "0.0.0.0" });
    console.log(`\x1b[35m%s\x1b[0m`, `✨[ GTT API Server - PORT ${PORT} ]✨`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
