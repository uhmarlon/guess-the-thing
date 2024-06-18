import {
  int,
  timestamp,
  decimal,
  mysqlTable,
  primaryKey,
  varchar,
  longtext,
} from "drizzle-orm/mysql-core";
import * as dotenv from "dotenv";
dotenv.config();

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const userLevels = mysqlTable("userlevel", {
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  levelpoints: int("levelpoints").notNull(),
});

export const games = mysqlTable("games", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  gametag: varchar("gametag", { length: 255 }),
});

export const gameStatistics = mysqlTable("game_statistics", {
  gameId: int("gameId")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  playerId: varchar("playerId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  score: int("score").notNull(),
  timestamp: timestamp("timestamp", { fsp: 3 }),
  rounds_played: int("rounds_played").notNull(),
  correct_rounds: int("correct_rounds").notNull(),
  language: varchar("language", { length: 255 }).notNull(),
});

export const preisguess = mysqlTable("preisguess", {
  id: int("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: longtext("image"),
  createdAt: timestamp("created_at"),
});
