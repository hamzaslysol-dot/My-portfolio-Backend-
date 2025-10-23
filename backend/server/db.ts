import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "blogdb",
  port: Number(process.env.DB_PORT) || 3306,
});

// ✅ Create Drizzle instance WITH schema generic
export const db = drizzle(pool, { schema, mode: "default" });
export const poolConnection = pool; // export pool for direct testing
