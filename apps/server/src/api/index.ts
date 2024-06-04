import type { FastifyInstance } from "fastify";

export async function apiindex(server: FastifyInstance): Promise<void> {
  server.get("/", async (request, reply) => {
    reply.send({ message: "GTT API Works", version: "1.0.0" });
  });
}
