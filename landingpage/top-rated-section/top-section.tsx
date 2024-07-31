"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import './top-section.css';

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
}

const TMDB_API_KEY = "1fc90dcd6c360d40d68b297f7b0e41ad";
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&region=US&page=1`;

export default function TopRatedSection({ width = "100%", height = "300px" }) {
  const [topRatedItems, setTopRatedItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ margin: "0", padding: "0" }}>
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
        }}
      >
        {loading || !topRatedItems.length
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 bloom-effect" style={{ width: "calc(100% / 5)", marginRight: "10px" }}>
                <Card className="border-none p-0">
                  <CardContent className="flex items-center justify-center p-0" style={{ height: "150px" }}>
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : topRatedItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 bloom-effect" style={{ width: "calc(100% / 5)", marginRight: "10px" }}>
                <Card className="border-none p-0">
                  <CardContent className="flex items-center justify-center p-0" style={{ height: "150px" }}>
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
    </div>
  );
}
