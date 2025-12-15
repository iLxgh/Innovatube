"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  viewCount?: string;
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  channelTitle,
  description,
  publishedAt,
  viewCount,
}: VideoCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get(`/favorites/check/${id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
    }
  };

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api.post("/favorites", {
          videoId: id,
          videoTitle: title,
          videoThumbnail: thumbnail,
          channelTitle,
          description,
          publishedAt,
        });
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatViewCount = (count?: string) => {
    if (!count) return "";
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          />
        </a>
        <Button
          size="sm"
          variant={isFavorite ? "default" : "secondary"}
          className="absolute top-2 right-2"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          {isFavorite ? "⭐" : "☆"}
        </Button>
      </div>
      <CardContent className="p-4">
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600"
        >
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{title}</h3>
        </a>
        <p className="text-xs text-gray-600 mb-1">{channelTitle}</p>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          {viewCount && <span>{formatViewCount(viewCount)}</span>}
          <span>•</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
