import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql, { Pool } from "mysql2/promise";
import * as schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

async function initializeDatabase(): Promise<MySql2Database<typeof schema>> {
  try {
    const connection: Pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.query("SELECT 1");

    const db: MySql2Database<typeof schema> = drizzle(connection, {
      schema,
      mode: "default",
    });

    console.log(
      `\x1b[35m%s\x1b[0m`,
      `✨[ GTT DB Service - DB Name ${process.env.DB_NAME} ]✨`
    );
    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export let db: MySql2Database<typeof schema>;

initializeDatabase()
  .then((initializedDb) => {
    db = initializedDb;
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
  });
