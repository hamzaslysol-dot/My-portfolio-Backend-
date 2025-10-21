import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  serial,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"),
  email: varchar("email", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
