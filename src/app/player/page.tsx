"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AspectRatio } from '@/components/ui/aspect-ratio'; 
import { Breadcrumb,BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator, } from '@/components/ui/breadcrumb';

export default function Player() {
  const [playerUrl, setPlayerUrl] = useState('');
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState('');

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await axios.get('/api/content');
        const { id, media_type } = response.data;
        const mediaTypeElement = document.getElementById("media_type");
        if (mediaTypeElement) {
          const mediaTypeValue = (mediaTypeElement as HTMLInputElement).value;
          setMediaType(mediaTypeValue);
        }

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
    <div>
      <div className='breadcrumb-container'style={{ margin: 0, padding: 0, marginTop: "4%", marginBottom: "2%" }}>
      <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" style={{ fontSize: "15px" }}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage id ="media_type"style={{ fontSize: "15px" }}>{mediaType}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            </BreadcrumbItem>
            <BreadcrumbPage style={{ fontSize: "15px" }}>i</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

    <div className="player-container">
      <AspectRatio ratio={20 / 10} className="bg-muted" style={{marginTop:"1%"}}>
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

    </div>
  );
}
