"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';

export default function Player() {
  const [playerUrl, setPlayerUrl] = useState('');
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState([]);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const fetchContentData = async (id, mediaType) => {
    try {
      setPlayerUrl(`https://vidsrc.xyz/embed/${mediaType}/${id}?autoplay=1`);

      // Fetch data from TMDB API
      const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits,recommendations,season`;
      const tmdbResponse = await axios.get(tmdbUrl);

      setTitle(tmdbResponse.data.title || tmdbResponse.data.name);
      setGenre(tmdbResponse.data.genres);
      setDescription(tmdbResponse.data.overview);
      setRating(tmdbResponse.data.vote_average.toFixed(1));
      setCast(tmdbResponse.data.credits.cast.slice(0, 6)); // Fetch top 6 cast members
      setRecommendations(tmdbResponse.data.recommendations.results.slice(0, 10)); // Fetch top 10 recommendations
      if (mediaType === 'tv') {
        setSeasons(tmdbResponse.data.seasons);
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError('Failed to load content. Please try again.');
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('/api/content');
        const { id, media_type } = response.data;

        if (id && media_type) {
          sessionStorage.setItem('contentId', id);
          sessionStorage.setItem('mediaType', media_type);

          setMediaType(media_type);
          fetchContentData(id, media_type);
        } else {
          setError('Content data is missing.');
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError('Failed to load content. Please try again.');
      }
    };

    fetchInitialData();
  }, []);

  const handleCardClick = async (item) => {
    const id = item.id;
    const mediaType = item.media_type || 'movie'; // Default to movie if media_type is undefined
    await fetchContentData(id, mediaType);
  };

  const handleSkipIntro = () => {
    // Skip intro functionality goes here
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!playerUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className='breadcrumb-container' style={{ margin: 0, padding: 0, marginTop: "4%", marginBottom: "2%" }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{ fontSize: "15px" }}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ fontSize: "15px" }}>{mediaType}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ fontSize: "15px" }}>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Player */}
      <div className="player-container" style={{ position: 'relative' }}>
        <AspectRatio ratio={20 / 10} className="bg-muted" style={{ marginTop: "1%" }}>
          <iframe
            src={playerUrl}
            title="Player"
            allowFullScreen
            allow="autoplay"
            referrerPolicy="origin"
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </AspectRatio>
        <button
          className="skip-intro-button"
          onClick={handleSkipIntro}
          style={{ position: 'absolute', top: '10%', right: '5%', zIndex: 10 }}
        >
          Skip Intro
        </button>
      </div>

      {/* Movie/TV Show Info */}
      <div className='info-container' style={{ marginLeft: '2%', marginRight: '2%' }}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl" style={{ marginTop: "4%" }}>{title}</h1>
        <div className="genre-box" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {genre.map((g) => (
            <span key={g.id} className="unclickable-box" style={{ padding: '8px 12px', backgroundColor: '#eee', color: "black" }}>{g.name}</span>
          ))}
        </div>
        {mediaType === 'tv' && (
          <div className="seasons-box" style={{ marginTop: '16px' }}>
            <h2 className="text-xl font-bold">Seasons</h2>
            <div className="seasons-list" style={{ display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {seasons.map((season) => (
                <div key={season.id} className="season-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                    alt={`Season ${season.season_number}`}
                    width={150}
                    height={225}
                    style={{ objectFit: 'cover' }}
                  />
                  <span>Season {season.season_number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p style={{ marginTop: '16px' }}>{description}</p>
        <p style={{ marginTop: '16px' }}><strong>Rating:</strong> {rating}</p>

        {/* Cast Section */}
        <div className="cast-section" style={{ marginTop: '24px' }}>
          <h2 className="text-xl font-bold">Cast</h2>
          <p>{cast.map((member) => member.name).join(', ')}</p>
          <div className="cast-images" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {cast.map((member) => (
              <Avatar key={member.cast_id} style={{ display: 'inline-flex' }}>
                <AvatarImage src={`https://image.tmdb.org/t/p/w200${member.profile_path}`} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section" style={{ marginTop: '32px', overflowX: 'auto', whiteSpace: 'nowrap', marginLeft: '2%' }}>
        <h2 className="text-xl font-bold">Recommended for You</h2>
        <div className="recommendations-list" style={{ display: 'flex', gap: '10px', marginTop: '8px', overflowY: 'hidden' }}>
          {recommendations.length === 0 ? (
            <Skeleton count={10} width={200} height={300} style={{ marginRight: '8px' }} />
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="recommendation-item flex-shrink-0 bloom-effect"
                style={{ width: "200px", cursor: 'pointer' }}
                onClick={() => handleCardClick({ id: rec.id, media_type: mediaType })}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                  alt={rec.title || rec.name}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
