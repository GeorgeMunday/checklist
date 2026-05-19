import { getPool } from "@/server";

export async function PUT(request: Request) {
  try {
    const { cityName } = await request.json();

    if (!cityName?.trim()) {
      return new Response(JSON.stringify({ error: "City name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pool = getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE public.imhere SET name = $1 RETURNING *`,
        [cityName.trim()],
      );

      if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: "No record found to update" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    console.error("Database update failed:", err);

    const pgError = err as { code?: string; message?: string };
    if (pgError.message === "DATABASE_URL is not set") {
      return new Response(
        JSON.stringify({ error: "Database is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}