"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Autoplay from 'embla-carousel-autoplay';
import './banner.css';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const autoplayPlugin = React.useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: true }), []);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          axios.get(MOVIE_API_URL),
          axios.get(TV_API_URL),
        ]);
        const movies = moviesResponse.data.results.slice(0, 3);
        const tvShows = tvResponse.data.results.slice(0, 3);

        const combinedData: MediaItem[] = [
          ...movies.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            description: movie.overview,
            backdrop_path: movie.backdrop_path,
          })),
          ...tvShows.map((show: any) => ({
            id: show.id,
            title: show.name,
            description: show.overview,
            backdrop_path: show.backdrop_path,
          })),
        ];

        setMediaItems(combinedData);
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
    };

    fetchMediaItems();
  }, []);

  return (
    <div className="banner-container">
      <Carousel
        style={{ width: '100%', height: '100%' }}
        className="relative"
        plugins={[autoplayPlugin]}
        onMouseEnter={() => autoplayPlugin.stop()}
      >
        <CarouselContent>
          {mediaItems.map((item, index) => (
            <CarouselItem key={item.id} className="carousel-item">
              <div className="carousel-item-content">
                <Card className="card">
                  <CardContent className="card-content">
                    <img
                      src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                      alt={`Image ${index + 1}`}
                      className="card-image"
                    />
                    <div className="overlay">
                      <div className="overlay-content">
                        <h2 className="title">{item.title}</h2>
                        <p className="description">{item.description}</p>
                        <div className="buttons">
                          <Button className="button">Play</Button>
                          <Button variant={"outline"} className="button info">Info</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
  
}
