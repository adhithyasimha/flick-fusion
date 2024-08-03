"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox"; // Import DialogBox component

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  genre_ids?: number[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}`;

export default function TvSection() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const response = await axios.get(TMDB_API_URL);
        setTvShows(response.data.results.slice(0, 18)); // Limit to 18 TV shows
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvShows();
  }, []);

  const handleCardClick = (show: TVShow) => {
    setSelectedShow(show);
  };

  const handleCloseDialog = () => {
    setSelectedShow(null);
  };

  const handlePlayClick = async () => {
    if (selectedShow) {
      try {
        await axios.post('/api/content', {
          id: selectedShow.id,
          media_type: 'tv',
        });
        router.push(`/player`);
      } catch (error) {
        console.error("Error posting content data:", error);
      }
    } else {
      console.error("No TV show selected to play");
    }
  };

  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0, marginLeft: "3%" }}>
      <div className="heading-section" style={{ margin: 0, padding: 0 }}>
        <h1
          className="scroll-m-20 font-semibold tracking-tight md: 'xl'"
          style={{ marginTop: "-3%", marginBottom: "2%" }}
        >
          TV Shows
        </h1>
      </div>
      <div
        className="tv-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(3, 250px)",
          gap: "20px",
          maxWidth: "97%",
          height: "900px",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {loading || !tvShows.length
          ? Array.from({ length: 18 }).map((_, index) => (
              <div key={index} className="bloom-effect">
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
                      height: "250px",
                      border: "none",
                    }}
                  >
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : tvShows.map((show) => (
              <div
                key={show.id}
                className="bloom-effect"
                onClick={() => handleCardClick(show)}
              >
                <Card
                  style={{
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <CardContent
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      height: "250px",
                      border: "none",
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const skeleton =
                          e.currentTarget.nextElementSibling as HTMLElement;
                        if (skeleton) {
                          skeleton.style.display = "none";
                        }
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const skeleton =
                          e.currentTarget.nextElementSibling as HTMLElement;
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

      {selectedShow && (
        <DialogBox
          open={!!selectedShow}
          onClose={handleCloseDialog}
          onPlayClick={handlePlayClick}
          mediaDetails={{
            title: selectedShow.name,
            release_date: selectedShow.release_date || "N/A",
            original_language: selectedShow.original_language || "N/A",
            overview: selectedShow.overview || "No overview available.",
            genres: [], // You can include genres if available
            backdrop_path: selectedShow.backdrop_path || "",
          }}
        />
      )}
    </div>
  );
}
