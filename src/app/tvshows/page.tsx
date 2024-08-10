"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  first_air_date?: string;
  original_language?: string;
  genres?: { name: string }[];
}

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  character: string;
  name: string;
  profile_path: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_URL = (page: number) =>
  `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
const GENRES_API_URL = `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`;
const POST_CONTENT_API_URL = "/api/content";

export default function TVShowSection() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

    const fetchTVShows = async (page: number) => {
      try {
        const response = await axios.get(TMDB_API_URL(page));
        const filteredShows = response.data.results.filter(
          (show: TVShow) => show.poster_path
        );
        setTVShows(filteredShows);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
    fetchTVShows(currentPage);
  }, [currentPage]);

  const handleCardClick = (show: TVShow) => {
    setSelectedShow(show);
  };

  const handleCloseDialog = () => {
    setSelectedShow(null);
  };

  const postContentData = async (show: TVShow) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${show.id}/credits?api_key=${TMDB_API_KEY}`
      );
      const cast = response.data.cast.slice(0, 5); // Limit to top 5 cast members

      const genreNames = show.genres?.map((genre) => genre.name) || [];

      const dataToSend = {
        id: show.id,
        media_type: "tv",
        title: show.name,
        genres: genreNames,
        release_year: show.first_air_date?.split("-")[0],
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
    if (selectedShow) {
      await postContentData(selectedShow);
      localStorage.setItem("tvShowId", selectedShow.id.toString());
      localStorage.setItem("mediaType", "tv");
      router.push(`/player`);
    } else {
      console.error("No TV show selected to play");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (currentPage > 1) {
      pages.push(
        <PaginationItem key="prev">
          <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
        </PaginationItem>
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink href="#" isActive={page === currentPage} onClick={() => handlePageChange(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <PaginationItem key="next">
          <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div style={{ margin: "0 0 0 0", padding: 0, marginLeft: "2%" }}>
      <div className="breadcrumb" style={{ margin: 0, padding: 0, marginTop: "4%", marginBottom: "4%" }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{ fontSize: "15px" }}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ fontSize: "15px" }}>TV Shows</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div
        className="tv-show-section"
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
        {loading || !tvShows.length
          ? Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="bloom-effect">
              <Card style={{ border: "none", padding: 0 }}>
                <CardContent
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    height: "300px",
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
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    width={500}
                    height={750}
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
      <div className="pagination" style={{ margin: "2rem 0", textAlign: "center" }}>
        <Pagination>
          <PaginationContent>{renderPagination()}</PaginationContent>
        </Pagination>
      </div>

      {selectedShow && (
        <DialogBox
          open={!!selectedShow}
          onClose={handleCloseDialog}
          onPlayClick={handlePlayClick}
          mediaDetails={{
            title: selectedShow.name,
            release_date: selectedShow.first_air_date,
            original_language: selectedShow.original_language,
            overview: selectedShow.overview,
            genres: selectedShow.genres,
            backdrop_path: selectedShow.backdrop_path,
          }}
        />
      )}
    </div>
  );
}