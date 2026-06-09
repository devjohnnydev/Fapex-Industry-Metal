import { Router } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, company, email, phone, message } = req.body as {
      name: string;
      company?: string;
      email: string;
      phone?: string;
      message: string;
    };

    if (!name || !email || !message) {
      res.status(400).json({ error: "Nome, e-mail e mensagem são obrigatórios." });
      return;
    }

    const [msg] = await db
      .insert(contactMessagesTable)
      .values({ name, company: company ?? "", email, phone: phone ?? "", message })
      .returning();

    res.status(201).json({ ok: true, id: msg.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save contact message");
    res.status(500).json({ error: "Erro ao salvar mensagem." });
  }
});

router.get("/", requireAdmin, async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch contact messages");
    res.status(500).json({ error: "Erro ao buscar mensagens." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { eq } = await import("drizzle-orm");
    const id = Number(req.params.id);
    await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete contact message");
    res.status(500).json({ error: "Erro ao deletar mensagem." });
  }
});

export default router;
