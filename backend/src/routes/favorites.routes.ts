import { Router } from "express";
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from "../controllers/favorites.controller";
import { authenticate } from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

// Apply authentication and rate limiting to all favorites routes
router.use(authenticate);
router.use(apiLimiter);

// POST /api/favorites
router.post("/", addFavorite);

// DELETE /api/favorites/:videoId
router.delete("/:videoId", removeFavorite);

// GET /api/favorites?search=query
router.get("/", getFavorites);

// GET /api/favorites/check/:videoId
router.get("/check/:videoId", checkFavorite);

export default router;
