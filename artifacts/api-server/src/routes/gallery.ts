import { Router } from "express";
import { db, galleryPhotosTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const photos = await db
      .select()
      .from(galleryPhotosTable)
      .orderBy(desc(galleryPhotosTable.createdAt));
    res.json(photos);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch gallery");
    res.status(500).json({ error: "Erro ao buscar fotos" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body as {
      title: string;
      imageUrl: string;
      description: string;
    };
    const [photo] = await db
      .insert(galleryPhotosTable)
      .values({ title, imageUrl, description })
      .returning();
    res.status(201).json(photo);
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery photo");
    res.status(500).json({ error: "Erro ao adicionar foto" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery photo");
    res.status(500).json({ error: "Erro ao deletar foto" });
  }
});

export default router;
