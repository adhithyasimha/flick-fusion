"use client";
import React from "react";
import Autoplay from 'embla-carousel-autoplay';
import './banner.css';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function Banner() {
  const carouselStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const autoplayPlugin = React.useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: true }), []);

  return (
    <div className="banner-container">
      <Carousel 
        style={carouselStyle} 
        className="relative"
        plugins={[autoplayPlugin]}
        onMouseEnter={() => autoplayPlugin.stop()}
        onMouseLeave={() => autoplayPlugin.play()}
      >
        <CarouselContent>
          {imageData.map((data, index) => (
            <CarouselItem key={index} className="carousel-item">
              <div className="carousel-item-content">
                <Card className="card">
                  <CardContent className="card-content">
                    <img
                      src={data.url}
                      alt={`Image ${index + 1}`}
                      className="card-image"
                    />
                    <div className="overlay">
                      <h2 className="title">{data.title}</h2>
                      <p className="description">{data.description}</p>
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

const imageData = [
  {
    url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fincinemas.sg%2Fmovieshowtimes%2FOppenheimer%2Fbanner.jpg&f=1&nofb=1&ipt=86aeeba2e0fb1b725f80406d9ffd9fb964816a299c78f1f8a7816da041fa1428&ipo=images",
    title: "Oppenheimer",
    description: "A film about the life of J. Robert Oppenheimer and the creation of the atomic bomb."
  },
  {
    url: "https://heroichollywood.com/wp-content/uploads/2016/02/Batman-v-Superman-Banner.jpg",
    title: "Batman v Superman",
    description: "The epic showdown between the Dark Knight and the Man of Steel."
  },
  {
    url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmecinemas.com%2Fassets%2Fimg%2Fposters%2FTopGunMaveRick_banner.jpg&f=1&nofb=1&ipt=b2c235b2a14e0da4e687cd32fe4025fa412c4edbec845a5f734d9252467a3919&ipo=images",
    title: "Top Gun: Maverick",
    description: "The return of Maverick in the high-flying sequel to Top Gun."
  }
];