"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Player() {
  const [playerUrl, setPlayerUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const storedId = localStorage.getItem('movieId');
        const storedMediaType = localStorage.getItem('mediaType') || 'movie';

        if (storedId) {
          const url = `https://vidsrc.net/embed/${storedMediaType}/${storedId}?autoplay=1`;
          setPlayerUrl(url);
        } else {
          const response = await axios.get('/api/content');
          const { id, media_type } = response.data;
          const url = `https://vidsrc.net/embed/${media_type}/${id}?autoplay=1`;
          setPlayerUrl(url);
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
    <div className="player-container">
      <iframe 
        style={{marginTop: '5px', padding: '0px'}}
        src={playerUrl}
        title="Movie Player"
        width="100%"
        height="500vh"
        allowFullScreen
        allow="autoplay"
        referrerPolicy="origin"
      ></iframe>
    </div>
  );
}