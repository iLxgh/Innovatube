import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
    userId: mongoose.Types.ObjectId;
    videoId: string;
    videoTitle: string;
    videoThumbnail: string;
    channelTitle: string;
    description?: string;
    publishedAt?: string;
    addedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        videoId: {
            type: String,
            required: [true, "Video ID is required"],
        },
        videoTitle: {
            type: String,
            required: [true, "Video title is required"],
        },
        videoThumbnail: {
            type: String,
            required: [true, "Video thumbnail is required"],
        },
        channelTitle: {
            type: String,
            required: [true, "Channel title is required"],
        },
        description: {
            type: String,
        },
        publishedAt: {
            type: String,
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

// Compound index to ensure a user can't favorite the same video twice
favoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });

// Index for faster queries
favoriteSchema.index({ userId: 1, addedAt: -1 });

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
