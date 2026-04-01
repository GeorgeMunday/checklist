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
      const result = await client.query(`SELECT * FROM ${formName}`);
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database query failed:", err);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
