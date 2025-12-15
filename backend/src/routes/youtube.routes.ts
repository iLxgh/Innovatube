import { Router } from "express";
import { search, getVideo } from "../controllers/youtube.controller";
import { authenticate } from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

// Apply authentication and rate limiting to all YouTube routes
router.use(authenticate);
router.use(apiLimiter);

// GET /api/youtube/search?q=query&pageToken=token&maxResults=12
router.get("/search", search);

// GET /api/youtube/video/:id
router.get("/video/:id", getVideo);

export default router;
