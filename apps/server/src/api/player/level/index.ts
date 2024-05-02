import type { FastifyInstance } from "fastify";
import { db } from "../../../db";
import { userLevels } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { LevelSystem } from "./levelsystem";
import { UserExists } from "../checks/exists";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/player/level", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        reply.code(401).send({ error: "No authorization header provided" });
        return;
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        reply.code(401).send({ error: "No token provided" });
        return;
      }
      const userExists = new UserExists();
      const exists = await userExists.checkUserExists(token);
      if (!exists) {
        reply.code(404).send({ error: "User not found" });
        return;
      }
      const data = await db
        .select()
        .from(userLevels)
        .where(eq(userLevels.userId, token));
      if (data.length === 0) {
        reply.code(404).send({ error: "User not found" });
        return;
      }
      const level = LevelSystem.getLevelInfo(data[0].levelpoints);
      reply.send(level);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}
