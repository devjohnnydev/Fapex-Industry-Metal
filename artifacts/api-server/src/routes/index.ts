import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import blogRouter from "./blog";
import galleryRouter from "./gallery";
import uploadRouter from "./upload";
import contactRouter from "./contact";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/admin", adminRouter);
router.use("/blog-posts", blogRouter);
router.use("/gallery", galleryRouter);
router.use("/uploads-handler", uploadRouter);
router.use("/contact", contactRouter);
router.use("/settings", settingsRouter);

export default router;

