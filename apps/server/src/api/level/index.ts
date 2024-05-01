import type { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/level", async (request, reply) => {
    reply.send({ level: 1 });
  });
}
