import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Favorite } from "../models/Favorite";

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { videoId, videoTitle, videoThumbnail, channelTitle, description, publishedAt } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const existing = await Favorite.findOne({ userId, videoId } as any);
        
        if (existing) {
            res.status(400).json({
                success: false,
                message: "Video already in favorites",
            });
            return;
        }

        const favorite = await Favorite.create({
            userId,
            videoId,
            videoTitle,
            videoThumbnail,
            channelTitle,
            description,
            publishedAt,
        });

        res.status(201).json({
            success: true,
            message: "Video added to favorites",
            data: favorite,
        });
    } catch (error: any) {
        console.error("Add favorite error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add favorite",
            error: error.message,
        });
    }
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { videoId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const result = await Favorite.findOneAndDelete({ userId, videoId } as any);

        if (!result) {
            res.status(404).json({
                success: false,
                message: "Favorite not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Video removed from favorites",
        });
    } catch (error: any) {
        console.error("Remove favorite error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove favorite",
            error: error.message,
        });
    }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { search } = req.query;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        let query: any = { userId };

        if (search && typeof search === "string") {
            query.$or = [
                { videoTitle: { $regex: search, $options: "i" } },
                { channelTitle: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const favorites = await Favorite.find(query).sort({ addedAt: -1 });

        res.status(200).json({
            success: true,
            data: favorites,
            count: favorites.length,
        });
    } catch (error: any) {
        console.error("Get favorites error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get favorites",
            error: error.message,
        });
    }
};

export const checkFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { videoId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const favorite = await Favorite.findOne({ userId, videoId } as any);

        res.status(200).json({
            success: true,
            isFavorite: !!favorite,
        });
    } catch (error: any) {
        console.error("Check favorite error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check favorite",
            error: error.message,
        });
    }
};
