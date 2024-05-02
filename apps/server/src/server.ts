import createFastify from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import index from "./api/player/level";

const PORT = 3005;
const server = createFastify();
server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization"],
});

const io: Server = new Server(server.server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
export { io };

server.register(index);

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
