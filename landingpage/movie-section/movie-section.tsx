"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  genres?: { name: string }[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

export default function Moviesection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDialog = () => {
    setSelectedMovie(null);
  };

  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0, marginLeft: "2%" }}>
      <div className="heading-section" style={{ margin: 0, padding: 0 }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight md: 'xl'" style={{ marginTop: "-8%", marginBottom: "2%" }}>
          Cinema
        </h1>
      </div>
      <div
        className="movie-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(3, 250px)",
          gap: "15px",
          maxWidth: "97%",
          height: "900px",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {loading || !movies.length
          ? Array.from({ length: 18 }).map((_, index) => (
              <div key={index} className="bloom-effect">
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "250px", border: "none" }}>
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </div>
            ))
          : movies.map((movie) => (
              <div key={movie.id} className="bloom-effect" onClick={() => handleCardClick(movie)}>
                <Card style={{ border: "none", padding: 0 }}>
                  <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 0, height: "250px", border: "none" }}>
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

      {selectedMovie && (
        <DialogBox
          open={!!selectedMovie}
          onClose={handleCloseDialog}
          mediaDetails={{
            title: selectedMovie.title,
            release_date: selectedMovie.release_date,
            original_language: selectedMovie.original_language,
            overview: selectedMovie.overview,
            genres: selectedMovie.genres,
            backdrop_path: selectedMovie.backdrop_path,
          }}
        />
      )}
    </div>
  );
}
