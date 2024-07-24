"use client";
import React from "react";
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function Banner() {
  const carouselStyle: React.CSSProperties = {
    width: '100%',
    height: '90%',
  };

  const autoplayPlugin = React.useMemo(() => Autoplay({ delay: 2000, stopOnInteraction: true }), []);

  return (
    <div className="flex justify-center items-center w-full h-[40vh]">
      <Carousel 
        style={carouselStyle} 
        className="relative"
        plugins={[autoplayPlugin]}
        onMouseEnter={() => autoplayPlugin.stop()}
        onMouseLeave={() => autoplayPlugin.reset()}
      >
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index} className="flex items-center justify-center">
              <div className="w-full h-full p-1 flex items-center justify-center">
                <Card className="w-full h-full overflow-hidden">
                  <CardContent className="flex w-full h-full items-center justify-center p-0">
                    <img
                      src={url}
                      alt={`Image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
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

const imageUrls = [
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fincinemas.sg%2Fmovieshowtimes%2FOppenheimer%2Fbanner.jpg&f=1&nofb=1&ipt=86aeeba2e0fb1b725f80406d9ffd9fb964816a299c78f1f8a7816da041fa1428&ipo=images",
  "https://heroichollywood.com/wp-content/uploads/2016/02/Batman-v-Superman-Banner.jpg","https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmecinemas.com%2Fassets%2Fimg%2Fposters%2FTopGunMaveRick_banner.jpg&f=1&nofb=1&ipt=b2c235b2a14e0da4e687cd32fe4025fa412c4edbec845a5f734d9252467a3919&ipo=images"
];
