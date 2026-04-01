import { Pool } from "pg";

// Load environment variables from .env.local
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  pool = new Pool({ connectionString });
  return pool;
}
