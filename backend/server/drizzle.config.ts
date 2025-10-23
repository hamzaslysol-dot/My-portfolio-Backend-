import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // ✅ correct relative path
  out: "./drizzle/migrations", // ✅ output migrations folder
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Hamza@321",
    database: process.env.DB_NAME || "my_portfolio",
  },
  verbose: true, // helpful for debugging
});
