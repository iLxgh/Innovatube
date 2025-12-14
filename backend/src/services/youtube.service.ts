import axios from "axios";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    viewCount?: string;
    likeCount?: string;
}

export interface YouTubeSearchResponse {
    videos: YouTubeVideo[];
    nextPageToken?: string;
    prevPageToken?: string;
    totalResults: number;
}

export const searchVideos = async (
    query: string,
    pageToken?: string,
    maxResults: number = 12
): Promise<YouTubeSearchResponse> => {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        
        if (!apiKey) {
            throw new Error("YOUTUBE_API_KEY is not configured");
        }

        const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
            params: {
                key: apiKey,
                q: query,
                part: "snippet",
                type: "video",
                maxResults,
                pageToken,
                order: "relevance",
            },
        });

        const videoIds = response.data.items.map((item: any) => item.id.videoId).join(",");

        // Get additional video details (statistics)
        const detailsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
            params: {
                key: apiKey,
                id: videoIds,
                part: "statistics,snippet",
            },
        });

        const videos: YouTubeVideo[] = detailsResponse.data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            viewCount: item.statistics?.viewCount,
            likeCount: item.statistics?.likeCount,
        }));

        return {
            videos,
            nextPageToken: response.data.nextPageToken,
            prevPageToken: response.data.prevPageToken,
            totalResults: response.data.pageInfo.totalResults,
        };
    } catch (error: any) {
        console.error("YouTube API error:", error.response?.data || error.message);
        throw new Error("Failed to search videos");
    }
};

export const getVideoById = async (videoId: string): Promise<YouTubeVideo | null> => {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        
        if (!apiKey) {
            throw new Error("YOUTUBE_API_KEY is not configured");
        }

        const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
            params: {
                key: apiKey,
                id: videoId,
                part: "snippet,statistics",
            },
        });

        if (response.data.items.length === 0) {
            return null;
        }

        const item = response.data.items[0];

        return {
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            viewCount: item.statistics?.viewCount,
            likeCount: item.statistics?.likeCount,
        };
    } catch (error: any) {
        console.error("YouTube API error:", error.response?.data || error.message);
        throw new Error("Failed to get video details");
    }
};
