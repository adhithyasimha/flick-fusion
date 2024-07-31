"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const TMDB_API_KEY = "1fc90dcd6c360d40d68b297f7b0e41ad"; 
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export default function Moviesection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(TMDB_API_URL);
        setMovies(response.data.results.slice(0, 18)); // Limit to 18 movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0 }}>
      <div className="heading-section" style={{ margin: 0, padding: 0 }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight md: 'xl'" style={{ marginTop: "-8%", marginBottom: "2%" }}>
          Cinema
        </h1>
      </div>
      <div className="movie-section" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(3, 250px)", gap: "15px", maxWidth: "100%", height: "900px", overflow: "hidden", margin: 0, padding: 0 }}>
        {loading || !movies.length
          ? Array.from({ length: 18 }).map((_, index) => ( // Change to 18 skeletons
              <div key={index} className="bloom-effect">
                <Card className="border-none p-0">
                  <CardContent className="flex items-center justify-center p-0" style={{ height: "250px" }}>
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : movies.map((movie) => (
              <div key={movie.id} className="bloom-effect">
                <Card className="border-none p-0">
                  <CardContent className="flex items-center justify-center p-0" style={{ height: "250px" }}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
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
