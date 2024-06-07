import type { FastifyInstance } from "fastify";
import { db } from "../../../db";
import { games, gameStatistics } from "../../../db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export default async function (server: FastifyInstance): Promise<void> {
  server.get("/game/statistices", async (request, reply) => {
    const gametag = (request.query as { gametag: string }).gametag;

    function getLastSunday(): Date {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const lastSunday = new Date(today);
      lastSunday.setDate(today.getDate() - dayOfWeek);

      return lastSunday;
    }
    const lastSunday = getLastSunday().setHours(0, 0, 0, 0);

    function getNextSunday(): Date {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + (7 - dayOfWeek));

      return nextSunday;
    }

    try {
      const gameId = await db
        .select()
        .from(games)
        .where(eq(games.gametag, gametag));
      if (gameId.length === 0) {
        reply.code(404).send({ error: "Game not found" });
        return;
      }

      const dataStatistics = await db
        .select({
          playerId: gameStatistics.playerId,
          score: gameStatistics.score,
          timestamp: gameStatistics.timestamp,
          language: gameStatistics.language,
        })
        .from(gameStatistics)
        .where(
          and(
            eq(gameStatistics.gameId, gameId[0].id),
            gte(gameStatistics.timestamp, new Date(lastSunday)),
            sql`(playerid, score) IN (SELECT playerid, MAX(score) FROM game_statistics GROUP BY playerid)`
          )
        );

      const statistices = {
        gametag: gametag,
        nextReset: getNextSunday(),
        statistics: dataStatistics,
      };

      reply.send(statistices);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}
