import createFastify from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import index from "./api/player/level";
import join from "./api/game/join";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = 3005;
const server = createFastify();

server.register(cors, {
  origin: process.env.development
    ? "http://localhost:3000"
    : ["https://www.guessthething.io", "https://guessthething.io"],

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization"],
});

const io: Server = new Server(server.server, {
  cors: {
    origin: process.env.development
      ? "http://localhost:3000"
      : ["https://www.guessthething.io", "https://guessthething.io"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});
export { io };
import { SocketSetup } from "./socket";

const socketSetup = new SocketSetup(io);
socketSetup.setup();

server.register(index);
server.register(join);

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: PORT });
    console.log(`\x1b[35m%s\x1b[0m`, `✨[ GTT API Server - PORT ${PORT} ]✨`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
