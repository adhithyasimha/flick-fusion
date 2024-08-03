"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";
import './top-section.css';

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  genres?: { name: string }[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&region=US&page=1`;

export default function TopRatedSection({ width = "100%", height = "300px" }) {
  const [topRatedItems, setTopRatedItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);

  useEffect(() => {
    const fetchTopRatedItems = async () => {
      try {
        const response = await axios.get(TMDB_API_URL);
        setTopRatedItems(response.data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching top-rated items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedItems();
  }, []);

  const handleCardClick = (item: Media) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const handlePlayClick = async () => {
    if (selectedItem) {
      try {
        await axios.post('/api/content', {
          id: selectedItem.id,
          media_type: 'movie', // Assuming this section is for movies
        });
        // Redirect to Player page after posting
        window.location.href = '/player';
      } catch (error) {
        console.error("Error posting content data:", error);
      }
    }
  };

  return (
    <div style={{ margin: "0", padding: "0", marginLeft: "2%" }}>
      <div className="heading-section" style={{ marginTop: "-20%", padding: "0" }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight">
          Top Rated Movies
        </h1>
      </div>
      <div
        className="top-rated-section"
        style={{
          display: "flex",
          overflowX: "scroll",
          maxWidth: width,
          height: height,
          zIndex: 1,
          position: "relative",
          border: "none"
        }}
      >
        {loading || !topRatedItems.length
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
              >
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "150px", border: "none" }}>
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : topRatedItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 bloom-effect"
                style={{ width: "calc(100% / 5)", marginRight: "10px" }}
                onClick={() => handleCardClick(item)}
              >
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "150px", border: "none" }}>
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
          onPlayClick={handlePlayClick}
          mediaDetails={{
            title: selectedItem.title || selectedItem.name,
            release_date: selectedItem.release_date,
            original_language: selectedItem.original_language,
            overview: selectedItem.overview,
            genres: selectedItem.genres,
            backdrop_path: selectedItem.backdrop_path,
          }}
        />
      )}
    </div>
  );
}
