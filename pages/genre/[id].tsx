"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogBox } from "@/components/DialogBox";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Content {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  genres?: { name: string }[];
  media_type: 'movie' | 'tv';
}

interface Genre {
  id: number;
  name: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const POST_CONTENT_API_URL = '/api/content';

export default function GenrePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [genreName, setGenreName] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`);
        setGenres(response.data.genres);
        const currentGenre = response.data.genres.find((genre: Genre) => genre.id === Number(id));
        if (currentGenre) {
          setGenreName(currentGenre.name);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchContent = async () => {
      if (id) {
        try {
          const [moviesResponse, tvShowsResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}`),
            axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${id}`)
          ]);

          const movies = moviesResponse.data.results.map((movie: any) => ({ ...movie, media_type: 'movie' }));
          const tvShows = tvShowsResponse.data.results.map((show: any) => ({ ...show, media_type: 'tv' }));

          const combinedContent = [...movies, ...tvShows].sort(() => Math.random() - 0.5).slice(0, 18);
          setContent(combinedContent);
        } catch (error) {
          console.error("Error fetching content:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGenres();
    fetchContent();
  }, [id]);

  const handleCardClick = (item: Content) => {
    setSelectedContent(item);
  };

  const handleCloseDialog = () => {
    setSelectedContent(null);
  };

  const postContentData = async (item: Content) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${item.media_type}/${item.id}/credits?api_key=${TMDB_API_KEY}`
      );
      const cast = response.data.cast.slice(0, 5);

      const genreNames = item.genres?.map((genre) => genre.name) || [];

      const dataToSend = {
        id: item.id,
        media_type: item.media_type,
        title: item.title || item.name,
        genres: genreNames,
        release_year: (item.release_date || item.first_air_date)?.split("-")[0],
        cast: cast.map((member: any) => ({
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
    if (selectedContent) {
      await postContentData(selectedContent);
      localStorage.setItem('contentId', selectedContent.id.toString());
      localStorage.setItem('mediaType', selectedContent.media_type);
      router.push(`/player`);
    } else {
      console.error("No content selected to play");
    }
  };

  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0, marginLeft: "2%" }}>
      <div className="breadcrumb" style={{ margin: 0, padding: 0, marginTop: "4%", marginBottom: "4%" }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{ fontSize: "15px" }}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/genres" style={{ fontSize: "15px" }}>Genres</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ fontSize: "15px" }}>{genreName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="heading-section" style={{ margin: 0, padding: 0 }}>
        <h1
          className="scroll-m-20 font-semibold tracking-tight md:text-xl"
          style={{ marginTop: "-8%", marginBottom: "2%" }}
        >
          {genreName}
        </h1>
      </div>
      <div
        className="content-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "310px",
          gap: "15px",
          maxWidth: "97%",
          height: "950px",
          overflow: "hidden",
          margin: 0,
        }}
      >
        {loading || !content.length
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
          : content.map((item) => (
              <div
                key={item.id}
                className="bloom-effect"
                onClick={() => handleCardClick(item)}
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
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name || ""}
                      width={500}
                      height={750}
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

      {selectedContent && (
        <DialogBox
          open={!!selectedContent}
          onClose={handleCloseDialog}
          onPlayClick={handlePlayClick}
          mediaDetails={{
            title: selectedContent.title || selectedContent.name,
            release_date: selectedContent.release_date || selectedContent.first_air_date,
            original_language: selectedContent.original_language,
            overview: selectedContent.overview,
            genres: selectedContent.genres,
            backdrop_path: selectedContent.backdrop_path,
          }}
        />
      )}
    </div>
  );
}
