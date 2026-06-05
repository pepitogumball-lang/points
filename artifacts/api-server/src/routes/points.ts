import { Router } from "express";
import { db, pointsTable } from "@workspace/db";

const router = Router();

async function getOrInitPoints(): Promise<number> {
  const rows = await db.select().from(pointsTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(pointsTable).values({ value: 0 }).returning();
    return inserted[0].value;
  }
  return rows[0].value;
}

router.get("/points", async (req, res) => {
  try {
    const points = await getOrInitPoints();
    res.json({ points });
  } catch (e) {
    req.log.error(e, "Failed to get points");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/points", async (req, res) => {
  const adminToken = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];

  if (adminToken !== "Holaquetalsoypepi5") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { points } = req.body as { points: number };
  if (typeof points !== "number") {
    return res.status(400).json({ error: "points must be a number" });
  }

  try {
    const rows = await db.select().from(pointsTable).limit(1);
    let updated: number;
    if (rows.length === 0) {
      const inserted = await db.insert(pointsTable).values({ value: points }).returning();
      updated = inserted[0].value;
    } else {
      const result = await db
        .update(pointsTable)
        .set({ value: points })
        .returning();
      updated = result[0].value;
    }
    return res.json({ success: true, points: updated });
  } catch (e) {
    req.log.error(e, "Failed to set points");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
