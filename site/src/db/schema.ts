import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  balance: real("balance").notNull(),
  description: text("description"),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  account_id: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  pair: varchar("pair", { length: 20 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  position: varchar("position", { length: 50 }).notNull(),
  outcome: text("outcome"),
  pnl: real("pnl"),
  chart: text("chart"),
  notes: text("notes"),
  tags: text("tags").array(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  messages: text("messages").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  account_id: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
});

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Chat = typeof chats.$inferSelect;

export type Outcome = "win" | "loss";
