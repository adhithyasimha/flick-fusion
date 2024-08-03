"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AspectRatio } from '@/components/ui/aspect-ratio'; // Import AspectRatio component

export default function Player() {
  const [playerUrl, setPlayerUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await axios.get('/api/content');
        const { id, media_type } = response.data;

        if (id && media_type) {
          const url = `https://vidsrc.net/embed/${media_type}/${id}?autoplay=1`;
          setPlayerUrl(url);
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
    <div className="player-container">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <iframe 
          src={playerUrl}
          title="Player"
          allowFullScreen
          allow="autoplay"
          referrerPolicy="origin"
          style={{ width: '100%', height: '100%', border: 'none' }} // Ensure iframe fits within the AspectRatio container
        ></iframe>
      </AspectRatio>
    </div>
  );
}
