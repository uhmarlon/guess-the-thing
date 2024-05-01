import createFastify from "fastify";
import { Server } from "socket.io";
import index from "./api/level";

const PORT = 3005;
const server = createFastify();

const io: Server = new Server(server.server, {
  cors: {
    origin: "*",
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
