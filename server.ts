import { Pool } from "pg";

// Load environment variables from .env.local
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

export const pool = new Pool({
  connectionString,
});
