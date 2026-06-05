import { pgTable, integer, serial } from "drizzle-orm/pg-core";

export const pointsTable = pgTable("points", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull().default(0),
});

export type Points = typeof pointsTable.$inferSelect;
