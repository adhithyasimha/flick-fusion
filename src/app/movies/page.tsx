"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const GENRES_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;
const POST_CONTENT_API_URL = '/api/content';

export default function Moviesection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
  const [totalPages, setTotalPages] = useState(1); // State to keep track of the total pages
  const router = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(GENRES_API_URL);
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchMovies = async (page: number) => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
        setMovies(response.data.results.slice(0, 18)); // Limit to 18 movies
        setTotalPages(response.data.total_pages); // Set the total pages from the response
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
    fetchMovies(currentPage); // Fetch movies based on the current page
  }, [currentPage]); // Re-run the effect when the current page changes

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDialog = () => {
    setSelectedMovie(null);
  };

  const postContentData = async (movie: Movie) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`
      );
      const cast = response.data.cast.slice(0, 5); // Limit to top 5 cast members

      const genreNames = movie.genres?.map((genre) => genre.name) || [];

      const dataToSend = {
        id: movie.id,
        media_type: "movie",
        title: movie.title,
        genres: genreNames,
        release_year: movie.release_date?.split("-")[0],
        cast: cast.map((member: Cast) => ({
          name: member.name,
          photo: member.profile_path,
        })),
        rating: response.data.vote_average,
      };

      await axios.post(POST_CONTENT_API_URL, dataToSend);
    } catch (error) {
      console.error("Error posting content data:", error);
    }
  };

  const handlePlayClick = async () => {
    if (selectedMovie) {
      await postContentData(selectedMovie);
      localStorage.setItem('movieId', selectedMovie.id.toString());
      localStorage.setItem('mediaType', 'movie');
      router.push(`/player`);
    } else {
      console.error("No movie selected to play");
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page); // Update the current page state
  };

  return (
    <div style={{ margin: "0 0 0 0", padding: 0, marginLeft: "2%" }}>
      <div className="breadcrumb" style={{ margin: 0, padding: 0, marginTop: "4%", marginBottom: "4%" }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{fontSize:"15px"}}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ fontSize: "15px" }}>Movies</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div
        className="movie-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "310px",
          gap: "15px",
          maxWidth: "97%",
          height: "950px",
          overflow: "hidden",
          margin: 0
        }}
      >
        {loading || !movies.length
          ? Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="bloom-effect">
              <Card style={{ border: "none", padding: 0 }}>
                <CardContent
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    height: "300px", // Increased card height
                    border: "none",

                  }}
                >
                  <Skeleton className="w-full h-full" />
                </CardContent>
              </Card>
            </div>
          ))
          : movies.map((movie) => (
            <div
              key={movie.id}
              className="bloom-effect"
              onClick={() => handleCardClick(movie)}
            >
              <Card style={{ border: "none", padding: 0 }}>
                <CardContent
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                    height: "310px",
                    border: "none",
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
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
      <div className="pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageClick(currentPage > 1 ? currentPage - 1 : 1)} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href="#" isActive={index + 1 === currentPage} onClick={() => handlePageClick(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageClick(currentPage < totalPages ? currentPage + 1 : totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination> 
      </div>

      {selectedMovie && (
        <DialogBox
          open={!!selectedMovie}
          onClose={handleCloseDialog}
          onPlayClick={handlePlayClick}
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
