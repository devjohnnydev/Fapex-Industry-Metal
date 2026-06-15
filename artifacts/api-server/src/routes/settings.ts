import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";
import fs from "fs";
import path from "path";

const router = Router();

// Resolve the settings file path relative to workspace root
const settingsPath = (() => {
  const cwd = process.cwd();
  const root = cwd.endsWith(path.join("artifacts", "api-server"))
    ? path.resolve(cwd, "../..")
    : cwd;
  return path.resolve(root, "artifacts/api-server/settings.json");
})();

interface SiteSettings {
  contact: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
  };
  company: {
    name: string;
    cnpj: string;
    description: string;
  };
}

const defaultSettings: SiteSettings = {
  contact: {
    email: "contato@fapex.com.br",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP – Brasil",
    website: "www.fapex.com.br",
  },
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    whatsapp: "",
  },
  company: {
    name: "FAPEX Industry Metal",
    cnpj: "",
    description: "",
  },
};

function loadSettings(): SiteSettings {
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, "utf-8");
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (err) {
    logger.error({ err }, "Failed to load settings");
  }
  return { ...defaultSettings };
}

function saveSettings(settings: SiteSettings): void {
  const dir = path.dirname(settingsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
}

// GET /api/settings — public (used by frontend footer etc.)
router.get("/", (_req, res) => {
  res.json(loadSettings());
});

// PUT /api/settings — admin only
router.put("/", requireAdmin, (req, res) => {
  try {
    const current = loadSettings();
    const body = req.body as Partial<SiteSettings>;

    const merged: SiteSettings = {
      contact: { ...current.contact, ...body.contact },
      social: { ...current.social, ...body.social },
      company: { ...current.company, ...body.company },
    };

    saveSettings(merged);
    logger.info("Site settings updated");
    res.json({ ok: true, settings: merged });
  } catch (err) {
    logger.error({ err }, "Failed to save settings");
    res.status(500).json({ error: "Erro ao salvar configurações" });
  }
});

export default router;
