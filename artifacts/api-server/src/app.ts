import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes";
import { logger } from "./lib/logger";

const isProd = process.env.NODE_ENV === "production";

const app: Express = express();

// Trust Railway's reverse proxy for secure cookies & correct IPs
if (isProd) {
  app.set("trust proxy", 1);
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "fapex-secret-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,   // HTTPS-only in production (Railway terminates TLS)
      sameSite: isProd ? "lax" : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Resolve workspace root regardless of cwd
const workspaceRoot = (() => {
  // Running via `node artifacts/api-server/dist/index.mjs` from project root
  // OR via `pnpm run dev` from artifacts/api-server/
  const cwd = process.cwd();
  if (cwd.endsWith(path.join("artifacts", "api-server"))) {
    return path.resolve(cwd, "../..");
  }
  return cwd;
})();

// Serve uploaded images
const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/api/uploads", express.static(uploadsDir));

// API routes
app.use("/api", router);

// ── PRODUCTION: serve built frontend + SPA fallback ──────────────────────────
if (isProd) {
  const frontendDist = path.resolve(workspaceRoot, "artifacts/fapex-website/dist/public");
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // SPA fallback — send index.html for any non-/api route
    app.get("*", (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
    logger.info({ frontendDist }, "Serving frontend static files");
  } else {
    logger.warn({ frontendDist }, "Frontend dist not found – run the build first");
  }
}

export default app;
