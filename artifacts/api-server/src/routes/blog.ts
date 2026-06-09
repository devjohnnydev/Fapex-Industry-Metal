import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.publishedAt));
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blog posts");
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

router.get("/all", requireAdmin, async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch all blog posts");
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id));
    if (!post) { res.status(404).json({ error: "Post não encontrado" }); return; }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blog post");
    res.status(500).json({ error: "Erro ao buscar post" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, content, imageUrl, published } = req.body as {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      imageUrl: string;
      published: boolean;
    };
    const [post] = await db
      .insert(blogPostsTable)
      .values({
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      })
      .returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, excerpt, content, imageUrl, published } = req.body as {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      imageUrl: string;
      published: boolean;
    };
    const [existing] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id));
    const [post] = await db
      .update(blogPostsTable)
      .set({
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        published: published ?? false,
        publishedAt: published && !existing?.published ? new Date() : existing?.publishedAt ?? null,
      })
      .where(eq(blogPostsTable.id, id))
      .returning();
    if (!post) { res.status(404).json({ error: "Post não encontrado" }); return; }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

export default router;
