import type { FastifyInstance } from "fastify";
import * as dotenv from "dotenv";
dotenv.config();

interface CreateIssueRequest {
  title: string;
  description: string;
}

export default async function (server: FastifyInstance): Promise<void> {
  server.post<{ Body: CreateIssueRequest }>(
    "/bugreport",
    async (request, reply) => {
      const { title, description } = request.body;

      if (!title || !description) {
        reply.code(400).send({ error: "Title and description are required" });
        return;
      }

      const githubToken = process.env.GITHUB_TOKEN;
      const repoOwner = "uhmarlon";
      const repoName = "new-guess-the-thing";

      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github+json",
              "Content-Type": "application/json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
            body: JSON.stringify({
              title,
              body: description,
              assignees: ["uhmarlon"],
              labels: ["bugreport"],
            }),
          }
        );
        if (!response.ok) {
          throw new Error(
            `GitHub API responded with status code ${response.status}`
          );
        }

        reply.code(200).send({ success: true });
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: "Internal server error", details: error });
      }
    }
  );
}
