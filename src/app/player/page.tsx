"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Genre {
  id: number;
  name: string;
}

interface CastMember {
  cast_id: number;
  name: string;
  profile_path: string;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface Episode {
  id: number;
  name: string;
  episode_number: number;
}

interface Recommendation {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: string;
}

export default function Player() {
  const [contentId, setContentId] = useState<string | null>(null);
  const [playerUrl, setPlayerUrl] = useState('');
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre[]>([]);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  const fetchContentData = async (id: string, mediaType: string) => {
    try {
      setPlayerUrl(`https://vidsrc.pro/embed/${mediaType}/${id}?autoplay=1`);

      // Fetch data from TMDB API
      const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits,recommendations,seasons`;
      const tmdbResponse = await axios.get(tmdbUrl);

      setTitle(tmdbResponse.data.title || tmdbResponse.data.name);
      setGenre(tmdbResponse.data.genres);
      setDescription(tmdbResponse.data.overview);
      setRating(tmdbResponse.data.vote_average.toFixed(1));
      setCast(tmdbResponse.data.credits.cast.slice(0, 6));
      setRecommendations(tmdbResponse.data.recommendations.results.slice(0, 10));
      setMediaType(mediaType);

      if (mediaType === 'tv') {
        setSeasons(tmdbResponse.data.seasons);
        if (tmdbResponse.data.seasons.length > 0) {
          const firstSeason = tmdbResponse.data.seasons[0].season_number;
          setSelectedSeason(firstSeason.toString());
          await fetchEpisodes(id, firstSeason);
        } else {
          setSeasons([]);
          setEpisodes([]);
          setSelectedSeason('');
        }
      } else {
        setSeasons([]);
        setEpisodes([]);
        setSelectedSeason('');
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError('Failed to load content. Please try again.');
    }
  };

  const fetchEpisodes = async (tvId: string, seasonNumber: number) => {
    try {
      const episodesUrl = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
      const episodesResponse = await axios.get(episodesUrl);
      setEpisodes(episodesResponse.data.episodes);
      if (episodesResponse.data.episodes.length > 0) {
        setSelectedEpisode(episodesResponse.data.episodes[0].episode_number.toString());
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('/api/content');
        const { id, media_type } = response.data;

        if (id && media_type) {
          setContentId(id);
          sessionStorage.setItem('contentId', id);
          sessionStorage.setItem('mediaType', media_type);
          await fetchContentData(id, media_type);
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

  useEffect(() => {
    if (contentId) {
      const mediaType = sessionStorage.getItem('mediaType') || 'movie';
      fetchContentData(contentId, mediaType);
    }
  }, [contentId]);

  const handleCardClick = (item: Recommendation) => {
    const id = item.id.toString();
    const mediaType = item.media_type || 'movie';
    setContentId(id);
    sessionStorage.setItem('contentId', id);
    sessionStorage.setItem('mediaType', mediaType);
  };

  const handleSeasonChange = async (value: string) => {
    setSelectedSeason(value);
    const tvId = sessionStorage.getItem('contentId');
    if (tvId) {
      await fetchEpisodes(tvId, parseInt(value));
      // Update player URL with the first episode of the selected season
      if (episodes.length > 0) {
        const firstEpisode = episodes[0].episode_number;
        setPlayerUrl(`https://vidsrc.pro/embed/tv/${tvId}/${value}/${firstEpisode}?autoplay=1`);
        setSelectedEpisode(firstEpisode.toString());
      }
    }
  };

  const handleEpisodeChange = (value: string) => {
    setSelectedEpisode(value);
    const tvId = sessionStorage.getItem('contentId');
    if (tvId && selectedSeason) {
      setPlayerUrl(`https://vidsrc.pro/embed/tv/${tvId}/${selectedSeason}/${value}?autoplay=1`);
    }
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
      <div className='breadcrumb-container' style={{ margin: '4% 0 2%' }}>
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
      </div>

      {/* Movie/TV Show Info */}
      <div className='info-container' style={{ margin: '0 2%' }}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl" style={{ marginTop: "3%" }}>{title}</h1>
        <div className="genre-box" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {genre.map((g) => (
            <span key={g.id} className="unclickable-box" style={{ padding: '8px 12px', backgroundColor: '#eee', color: "black" }}>{g.name}</span>
          ))}
        </div>
        {mediaType === 'tv' && (
          <div className="seasons-box" style={{ marginTop: '16px' }}>
            <h2 className="text-xl font-bold">Seasons</h2>
            <Select onValueChange={handleSeasonChange} value={selectedSeason}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.season_number.toString()}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {mediaType === 'tv' && episodes.length > 0 && (
          <div className="episodes-box" style={{ marginTop: '16px' }}>
            <h2 className="text-xl font-bold">Episodes</h2>
            <Select onValueChange={handleEpisodeChange} value={selectedEpisode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select episode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {episodes.map((episode) => (
                    <SelectItem key={episode.id} value={episode.episode_number.toString()}>
                      {episode.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
      <div className="recommendations-section" style={{ marginTop: '32px', marginLeft: '2%' }}>
        <h2 className="text-xl font-bold">Recommended for You</h2>
        <div className="recommendations-list" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '8px', 
          overflowX: 'auto', 
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style jsx global>{`
            .recommendations-list::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {recommendations.length === 0 ? (
            Array(10).fill(0).map((_, index) => (
              <Skeleton key={index}  style={{ marginRight: '8px',width:"200px",height:"300px" }} />
            ))
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="recommendation-item flex-shrink-0 bloom-effect"
                style={{ width: "200px", cursor: 'pointer' }}
                onClick={() => handleCardClick(rec)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                  alt={rec.title || rec.name || ''}
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