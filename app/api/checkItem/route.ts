import { getPool } from "@/server";

export async function POST(request: Request) {
  try {
    const pool = getPool();
    const { table, id } = await request.json();
    if (!table || typeof id !== "number") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'table' or 'id'" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(table)) {
      return new Response(JSON.stringify({ error: "Invalid table name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const client = await pool.connect();
    try {
      const tableExists = await client.query(
        "SELECT to_regclass($1) IS NOT NULL AS exists",
        [`public.${table}`],
      );

      if (!tableExists.rows[0]?.exists) {
        return new Response(JSON.stringify({ error: "Table not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await client.query(
        `UPDATE ${table} SET completed = NOT completed WHERE id = $1 RETURNING *`,
        [id],
      );

      if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
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
    console.error("Failed to update item status:", err);

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

    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
