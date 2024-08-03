"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox"; // Import DialogBox component

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  original_language: string;
  genre_ids: number[];
  media_type: string; // Add media_type to the Media interface
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`;

export default function TrendingSection({ width = "100%", height = "300px" }) {
  const [trendingItems, setTrendingItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const response = await axios.get(TMDB_API_URL);
        setTrendingItems(response.data.results.slice(0, 10)); // Limit to 10 items
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  const handleCardClick = (item: Media) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const handlePlayClick = () => {
    if (selectedItem) {
      console.log(`POST method message: { id: ${selectedItem.id}, media_type: ${selectedItem.media_type} }`);
    }
  };

  return (
    <div style={{ margin: "0", padding: "0", marginLeft: "2%", marginBottom: "10px" }}>
      <div className="heading-section" style={{ marginTop: "20%", padding: "0" }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight">What's Cookin</h1>
      </div>
      <div
        className="trending-section"
        style={{
          display: "flex",
          overflowX: "scroll",
          overflowY: "hidden", // Hide vertical scrollbar
          scrollbarWidth: "none", // Firefox scrollbar
          msOverflowStyle: "none", // Internet Explorer and Edge
          maxWidth: width,
          height: height,
          zIndex: 1,
          position: "relative",
        }}
      >
        {loading || !trendingItems.length
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
              >
                <Card
                  style={{
                    border: "none",
                    padding: 0,
                  }}
                >
                  <CardContent
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      height: "150px",
                      border: "none",
                    }}
                  >
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : trendingItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
              >
                <Card
                  style={{
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  onClick={() => handleCardClick(item)}
                >
                  <CardContent
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      height: "150px",
                      border: "none",
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const skeleton = e.currentTarget.nextElementSibling as HTMLElement;
                        if (skeleton) {
                          skeleton.style.display = "none";
                        }
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const skeleton = e.currentTarget.nextElementSibling as HTMLElement;
                        if (skeleton) {
                          skeleton.style.display = "block";
                        }
                      }}
                    />
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))}
      </div>

      {selectedItem && (
        <DialogBox
          open={!!selectedItem}
          onClose={handleCloseDialog}
          mediaDetails={{
            title: selectedItem.title || selectedItem.name,
            release_date: selectedItem.release_date,
            original_language: selectedItem.original_language,
            overview: selectedItem.overview,
            genres: [], // Optionally, add genre data if available
            backdrop_path: selectedItem.backdrop_path,
          }}
          onPlayClick={handlePlayClick} // Pass handlePlayClick to DialogBox
        />
      )}
    </div>
  );
}
