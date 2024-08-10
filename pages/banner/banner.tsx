"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import './banner.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogBox } from "@/components/DialogBox";
import Image from "next/image";

interface MediaItem {
  id: number;
  title: string;
  description: string;
  backdrop_path: string;
  release_date?: string;
  original_language?: string;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const POPULAR_MOVIE_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`;
const POST_CONTENT_API_URL = '/api/content';

export default function Banner() {
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMediaItem = async () => {
      try {
        const response = await axios.get(POPULAR_MOVIE_API_URL);
        const topMovie = response.data.results[0];
        const mediaItem: MediaItem = {
          id: topMovie.id,
          title: topMovie.title,
          description: topMovie.overview,
          backdrop_path: topMovie.backdrop_path,
          release_date: topMovie.release_date,
          original_language: topMovie.original_language,
        };
        setMediaItem(mediaItem);
      } catch (error) {
        console.error("Error fetching media item:", error);
      }
    };

    fetchMediaItem();
  }, []);

  const postContentData = async (id: number, mediaType: string) => {
    const dataToSend = { id, media_type: mediaType };
    try {
      await axios.post(POST_CONTENT_API_URL, dataToSend);
    } catch (error) {
      console.error("Error posting content data:", error);
    }
  };

  const handlePlayClick = () => {
    if (mediaItem) {
      localStorage.setItem('movieId', mediaItem.id.toString());
      postContentData(mediaItem.id, 'movie');
      router.push('/player');
    } else {
      console.error("No media item available to play");
    }
  };

  const handleInfoClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (!mediaItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="banner-wrapper">
      <div className="banner-container">
        <Card className="card">
          <CardContent className="card-content">
            <Image
              src={`https://image.tmdb.org/t/p/original${mediaItem.backdrop_path}`}
              alt={`Image of ${mediaItem.title}`}
              width={1920}
              height={1080}
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
        <Button className="button" variant="destructive" onClick={handlePlayClick}>Play</Button>
        <Button variant="outline" className="button info" onClick={handleInfoClick}>Info</Button>
      </div>

      <DialogBox
        open={dialogOpen}
        onClose={handleCloseDialog}
        mediaDetails={{
          title: mediaItem.title,
          description: mediaItem.description,
          backdrop_path: mediaItem.backdrop_path,
          release_date: mediaItem.release_date,
          original_language: mediaItem.original_language,
        }}
        onPlayClick={handlePlayClick}
      />
    </div>
  );
}
