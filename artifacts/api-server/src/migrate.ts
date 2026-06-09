import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { logger } from "./lib/logger";

export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    logger.warn("DATABASE_URL not set, skipping migrations");
    return;
  }

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Migration timed out after 10s")), 10_000),
  );

  try {
    await Promise.race([migrate(), timeout]);
    logger.info("Migrations ran successfully");
  } catch (err) {
    logger.error({ err }, "Migration error");
    throw err;
  }
}

async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id           SERIAL PRIMARY KEY,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL UNIQUE,
      excerpt      TEXT NOT NULL DEFAULT '',
      content      TEXT NOT NULL DEFAULT '',
      image_url    TEXT NOT NULL DEFAULT '',
      published    BOOLEAN NOT NULL DEFAULT false,
      published_at TIMESTAMPTZ,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS gallery_photos (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL DEFAULT '',
      image_url   TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
