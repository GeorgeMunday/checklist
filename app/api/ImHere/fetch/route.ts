import { getPool } from "@/server";

export async function GET(_request: Request) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const tableExists = await client.query(
        "SELECT to_regclass($1) IS NOT NULL AS exists",
        ["public.imhere"],
      );

      if (!tableExists.rows[0]?.exists) {
        await client.query(`
          CREATE TABLE public.imhere (
            name TEXT PRIMARY KEY
          )
        `);

        const defaultCity = "England";
        await client.query(`INSERT INTO public.imhere (name) VALUES ($1)`, [
          defaultCity,
        ]);
      }

      const result = await client.query(
        `SELECT * FROM public.imhere ORDER BY name ASC`,
      );
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    console.error("Database query failed:", err);

    const pgError = err as { code?: string; message?: string };
    if (pgError.code === "42P01") {
      return new Response(JSON.stringify({ error: "Table not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pgError.message === "DATABASE_URL is not set") {
      return new Response(
        JSON.stringify({ error: "Database is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}