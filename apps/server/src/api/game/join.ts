import type { FastifyInstance } from "fastify";
import GameDataManager from "../../socket/gameDataManager";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/join", async (request, reply) => {
    try {
      const code = (request.query as { code: string }).code;
      if (!code) {
        reply.code(400).send({ error: "No code provided" });
        return;
      }
      const data = await GameDataManager.getLobbyIdByCode(code);

      if (data === "error") {
        reply.code(404).send({ error: "Game not found" });
        return;
      }
      reply.send(data);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}
