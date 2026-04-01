import { getPool } from "@/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formName: string }> },
) {
  const { formName } = await params;

  if (!formName) {
    return new Response(JSON.stringify({ error: "Missing table name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(formName)) {
    return new Response(JSON.stringify({ error: "Invalid table name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const tableExists = await client.query(
        "SELECT to_regclass($1) IS NOT NULL AS exists",
        [`public.${formName}`],
      );

      if (!tableExists.rows[0]?.exists) {
        return new Response(JSON.stringify({ error: "Table not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await client.query(`SELECT * FROM ${formName}`);
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
