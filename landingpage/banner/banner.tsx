"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './banner.css';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: number;
  title: string;
  description: string;
  backdrop_path: string;
}

const TMDB_API_KEY = "1fc90dcd6c360d40d68b297f7b0e41ad";
const MOVIE_API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`;
const TV_API_URL = `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}`;

export function Banner() {
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMediaItem = async () => {
      try {
        const [movieResponse, tvResponse] = await Promise.all([
          axios.get(MOVIE_API_URL),
          axios.get(TV_API_URL),
        ]);

        const topMovie = movieResponse.data.results[0];
        const topTvShow = tvResponse.data.results[0];

        const item = Math.random() > 0.5 ? topMovie : topTvShow;
        const mediaItem: MediaItem = {
          id: item.id,
          title: item.title || item.name,
          description: item.overview,
          backdrop_path: item.backdrop_path,
        };

        setMediaItem(mediaItem);
      } catch (error) {
        console.error("Error fetching media item:", error);
      }
    };

    fetchMediaItem();
  }, []);

  if (!mediaItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="banner-wrapper">
      <div className="banner-container">
        <Card className="card">
          <CardContent className="card-content">
            <img
              src={`https://image.tmdb.org/t/p/original${mediaItem.backdrop_path}`}
              alt={`Image of ${mediaItem.title}`}
              className="card-image"
            />
            <div className="overlay">
              <div className="overlay-content">
                <h2 className="title">{mediaItem.title}</h2>
                <p className="description">{mediaItem.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="buttons-container">
        <Button className="button">Play</Button>
        <Button variant="outline" className="button info">Info</Button>
      </div>
    </div>
  );
}
