import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "fapex@admin2024";

router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    (req.session as any).isAdmin = true;
    req.log.info("Admin login successful");
    res.json({ ok: true });
  } else {
    req.log.warn("Admin login failed");
    res.status(401).json({ error: "Senha incorreta" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "Session destroy error");
      res.status(500).json({ error: "Erro ao sair" });
    } else {
      res.json({ ok: true });
    }
  });
});

router.get("/me", (req, res) => {
  res.json({ isAdmin: !!(req.session as any).isAdmin });
});

export default router;
