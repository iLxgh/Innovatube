import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { searchVideos, getVideoById } from "../services/youtube.service";

export const search = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { q, pageToken, maxResults } = req.query;

        if (!q || typeof q !== "string") {
            res.status(400).json({
                success: false,
                message: "Search query is required",
            });
            return;
        }

        const max = maxResults ? parseInt(maxResults as string) : 12;
        const result = await searchVideos(q, pageToken as string | undefined, max);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error("YouTube search error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search videos",
            error: error.message,
        });
    }
};

export const getVideo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "Video ID is required",
            });
            return;
        }

        const video = await getVideoById(id);

        if (!video) {
            res.status(404).json({
                success: false,
                message: "Video not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error: any) {
        console.error("YouTube get video error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get video",
            error: error.message,
        });
    }
};
