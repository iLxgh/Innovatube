"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  viewCount?: string;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);

  const searchVideos = async (query: string, pageToken?: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsLoading(true);
    try {
      const params: any = { q: query };
      if (pageToken) params.pageToken = pageToken;

      const response = await api.get("/youtube/search", { params });

      if (response.data.success) {
        setVideos(response.data.data.videos);
        setNextPageToken(response.data.data.nextPageToken || null);
        setPrevPageToken(response.data.data.prevPageToken || null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to search videos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos(searchQuery);
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      searchVideos(searchQuery, nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      searchVideos(searchQuery, prevPageToken);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        searchVideos(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Search YouTube Videos</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </div>

          {isLoading && videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Searching...</div>
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video.id} {...video} />
                ))}
              </div>

              {(nextPageToken || prevPageToken) && (
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    onClick={handlePrevPage}
                    disabled={!prevPageToken || isLoading}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={!nextPageToken || isLoading}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">Start Searching</h2>
              <p className="text-gray-600">
                Enter a search query to find YouTube videos
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
