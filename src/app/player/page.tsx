"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio'; 
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await axios.get('/api/content');
        const { id, media_type } = response.data;

        if (id && media_type) {
          sessionStorage.setItem('contentId', id);
          sessionStorage.setItem('mediaType', media_type);

          setMediaType(media_type);
          const url = `https://vidsrc.xyz/embed/${media_type}/${id}?autoplay=1`;
          setPlayerUrl(url);

          // Fetch data from TMDB API
          const tmdbUrl = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits,recommendations`;
          const tmdbResponse = await axios.get(tmdbUrl);
          
          setTitle(tmdbResponse.data.title || tmdbResponse.data.name);
          setGenre(tmdbResponse.data.genres);
          setDescription(tmdbResponse.data.overview);
          setRating(tmdbResponse.data.vote_average);
          setCast(tmdbResponse.data.credits.cast.slice(0, 5)); // Fetch top 5 cast members
          setRecommendations(tmdbResponse.data.recommendations.results.slice(0, 5)); // Fetch top 5 recommendations
        } else {
          setError('Content data is missing.');
        }
      } catch (error) {
        console.error("Error fetching content data:", error);
        setError('Failed to load content. Please try again.');
      }
    };

    fetchContentData();
  }, []);

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
      <div className="player-container">
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
      <div className='info-container'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl" style={{marginTop:"4%"}}>{title}</h1>
        <div className="genre-box" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {genre.map((g) => (
            <span key={g.id} className="unclickable-box" style={{ padding: '8px 12px', backgroundColor: '#eee', color:"black" }}>{g.name}</span>
          ))}
        </div>
        <p style={{ marginTop: '16px' }}>{description}</p>
        <p style={{ marginTop: '16px' }}><strong>Rating:</strong> {rating}</p>

        {/* Cast Section */}
        <div className="cast-section" style={{ marginTop: '24px' }}>
          <h2 className="text-xl font-bold">Cast</h2>
          <div className="cast-list" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {cast.map((member) => (
              <div key={member.cast_id} className="cast-member" style={{ textAlign: 'center' }}>
                <Avatar>
                  <AvatarImage src={`https://image.tmdb.org/t/p/w200${member.profile_path}`} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p>{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section" style={{ marginTop: '32px' }}>
        <h2 className="text-xl font-bold">Recommended for You</h2>
        <div className="recommendations-list" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {recommendations.map((rec) => (
            <div key={rec.id} className="recommendation-item">
              <Image 
                src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`} 
                alt={rec.title || rec.name} 
                width={200} 
                height={300} 
                style={{ borderRadius: '8px' }} 
              />
              <p>{rec.title || rec.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
