"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

interface Favorite {
  _id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  addedAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = favorites.filter(
        (fav) =>
          fav.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fav.channelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fav.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  }, [searchQuery, favorites]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/favorites");
      if (response.data.success) {
        setFavorites(response.data.data);
        setFilteredFavorites(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteRemoved = () => {
    // Refresh favorites list after a video is removed
    fetchFavorites();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">My Favorites</h1>
            {favorites.length > 0 && (
              <Input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading favorites...</div>
            </div>
          ) : filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((favorite) => (
                <VideoCard
                  key={favorite._id}
                  id={favorite.videoId}
                  title={favorite.videoTitle}
                  thumbnail={favorite.videoThumbnail}
                  channelTitle={favorite.channelTitle}
                  description={favorite.description}
                  publishedAt={favorite.publishedAt}
                />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
              <p className="text-gray-600">
                Start adding videos to your favorites from the search page
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">No Results</h2>
              <p className="text-gray-600">
                No favorites match your search query
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
