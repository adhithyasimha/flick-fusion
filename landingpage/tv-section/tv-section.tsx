"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TvSection() {
  return (
    <div style={{ margin: "-25px 0 0 0", padding: 0 }}>
      <div className="heading-section" style={{ margin: 0, padding: 0 }}>
        <h1 className="scroll-m-20 font-semibold tracking-tight md: 'xl'" style={{ marginTop: "-3%", marginBottom: "2%" }}>
          TV Shows
        </h1>
      </div>
      <div className="tv-section" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(3, 250px)", gap: "20px", maxWidth: "100%", height: "900px", overflow: "hidden", margin: 0, padding: 0 }}>
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="bloom-effect">
            <Card className="border-none p-0">
              <CardContent className="flex items-center justify-center p-0" style={{ height: "250px" }}>
                <Skeleton className="w-full h-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
