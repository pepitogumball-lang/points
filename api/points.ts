import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool, type PoolClient } from "pg";

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

const ADMIN_TOKEN = "Holaquetalsoypepi5";

async function ensureTable(client: PoolClient): Promise<void> {
  await client.query(
    `CREATE TABLE IF NOT EXISTS points (id SERIAL PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0)`
  );
}

async function getOrInitPoints(client: PoolClient): Promise<number> {
  await ensureTable(client);
  const result = await client.query("SELECT value FROM points LIMIT 1");
  if (result.rows.length === 0) {
    const ins = await client.query(
      "INSERT INTO points (value) VALUES (0) RETURNING value"
    );
    return ins.rows[0].value as number;
  }
  return result.rows[0].value as number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const client = await getPool().connect();
  try {
    if (req.method === "GET") {
      const points = await getOrInitPoints(client);
      return res.json({ points });
    }

    if (req.method === "POST") {
      const cookieToken = ((req.headers.cookie as string) ?? "")
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("admin_token="))
        ?.split("=")[1];

      const headerToken = req.headers["x-admin-token"] as string | undefined;

      if (cookieToken !== ADMIN_TOKEN && headerToken !== ADMIN_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const body = req.body as { points?: unknown };
      if (typeof body.points !== "number") {
        return res.status(400).json({ error: "points must be a number" });
      }

      await ensureTable(client);
      const existing = await client.query("SELECT id FROM points LIMIT 1");
      let updated: number;
      if (existing.rows.length === 0) {
        const ins = await client.query(
          "INSERT INTO points (value) VALUES ($1) RETURNING value",
          [body.points]
        );
        updated = ins.rows[0].value as number;
      } else {
        const upd = await client.query(
          "UPDATE points SET value = $1 RETURNING value",
          [body.points]
        );
        updated = upd.rows[0].value as number;
      }
      return res.json({ success: true, points: updated });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } finally {
    client.release();
  }
}
