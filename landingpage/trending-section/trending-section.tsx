"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";
import './trending-section.css';

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  original_language?: string;
  genre_ids?: number[];
}

const TMDB_API_KEY = "1fc90dcd6c360d40d68b297f7b0e41ad";
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

  return (
    <div style={{ margin: "0", padding: "0", marginLeft: "2%", marginBottom: "10px" }}>
      <div className="heading-section" style={{ marginTop: "20%", padding: "0" }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight">
          What's Cookin
        </h1>
      </div>
      <div
        className="trending-section"
        style={{
          display: "flex",
          overflowX: "scroll",
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
                className="flex-shrink-0 trending-card bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
              >
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "150px" }}>
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : trendingItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 trending-card bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
                onClick={() => handleCardClick(item)}
              >
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "150px" }}>
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
          mediaDetails={{
            title: selectedItem.title || selectedItem.name,
            release_date: selectedItem.release_date,
            original_language: selectedItem.original_language,
            overview: selectedItem.overview,
            genres: selectedItem.genre_ids?.map(id => ({ name: `Genre ${id}` })) // Placeholder for genre names
          }}
          open={!!selectedItem}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}
