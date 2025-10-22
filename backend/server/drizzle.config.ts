import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

// Helper to ensure env variables exist
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable ${key}`);
  return value;
};

// Build MySQL connection URL
const connectionUrl = `mysql://${getEnv("DB_USER")}:${encodeURIComponent(
  getEnv("DB_PASS")
)}@${getEnv("DB_HOST")}:${getEnv("DB_PORT")}/${getEnv("DB_NAME")}`;

export default defineConfig({
  schema: "./schema/*.ts", // path to your table schemas
  out: "./drizzle", // folder to output migration files
  driver: "mysql2",
});
