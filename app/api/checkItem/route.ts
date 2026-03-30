import { pool } from "@/server";

export async function POST(request: Request) {
  try {
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
    const result = await client.query(
      `UPDATE ${table} SET completed = NOT completed WHERE id = $1 RETURNING *`,
      [id],
    );
    client.release();
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
  } catch (err) {
    console.error("Failed to update item status:", err);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
