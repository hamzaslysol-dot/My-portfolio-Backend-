import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, serial, varchar, text, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const blogs = mysqlTable("blogs", {
	id: serial().notNull(),
	title: varchar({ length: 255 }).notNull(),
	author: varchar({ length: 100 }).notNull(),
	content: text().notNull(),
	image: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blogs_id"}),
	unique("id").on(table.id),
]);

export const users = mysqlTable("users", {
	id: serial().notNull(),
	username: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	role: varchar({ length: 50 }).default('admin').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	picture: varchar({ length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("id").on(table.id),
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);
