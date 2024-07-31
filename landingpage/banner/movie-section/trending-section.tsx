import React from 'react';
import './trending-section.css';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

interface TrendingSectionProps {
  width?: string;
  height?: string;
}

export default function TrendingSection({ width = "100%", height = "300px" }: TrendingSectionProps) {
  return (
    <div>
      <div className="heading-section">
        <h1 className="scroll-m-20 font-semibold tracking-tight md: 'xl'">
          What's Cookin
        </h1>
      </div>
      <div className="trending-section" style={{ maxWidth: width, height: height }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 bloom-effect" style={{ width: "calc(100% / 5)" }}>
            <Card className="border-none p-0">
              <CardContent className="flex items-center justify-center p-0" style={{ height: "150px" }}>
                <Skeleton className="w-full h-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}