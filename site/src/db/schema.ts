import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  real,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const outcomeEnum = pgEnum("outcome", ["win", "loss"]);

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
  account_id: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  pair: varchar("pair", { length: 10 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  bias: varchar("bias", { length: 50 }).notNull(),
  point_of_interest: text("point_of_interest").array(),
  outcome: outcomeEnum("outcome"),
  pnl: real("pnl"),
  chart: varchar("chart", { length: 2048 }),
  notes: text("notes"),
  tags: text("tags").array(),
});

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Trade = typeof trades.$inferSelect;

export type Outcome = "win" | "loss";
