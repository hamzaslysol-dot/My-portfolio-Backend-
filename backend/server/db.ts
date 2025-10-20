import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// ✅ Create a MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Hamza@321",
  database: process.env.DB_NAME || "blogdb",
});
console.log("✅ MySQL Pool created");
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);

// ✅ Create Drizzle ORM instance (optional, for typed queries)
export const db = drizzle(pool);

// ✅ Export the pool for raw SQL access
export const raw = pool;
