"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
}

const TMDB_API_KEY = "1fc90dcd6c360d40d68b297f7b0e41ad"; 
const TMDB_API_URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}`;

export default function TvSection() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0,marginLeft:"2%" }}>
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
              <div key={show.id} className="bloom-effect">
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
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
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
    </div>
  );
}
