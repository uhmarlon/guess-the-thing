import createFastify from "fastify";
import { Server } from "socket.io";

const PORT = 3005;
const server = createFastify();

const io: Server = new Server(server.server, {
  cors: {
    origin: "*",
  },
});

export { io };

if (require.main === module) {
  server.listen({ port: PORT }).catch((err) => {
    server.log.error(err);
    process.exit(1);
  });
}
