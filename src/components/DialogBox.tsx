import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogBoxProps {
  open: boolean;
  onClose: () => void;
  mediaDetails: {
    backdrop_path?: string;
    title?: string;
    release_date?: string;
    original_language?: string;
    genres?: { name: string }[];
    overview?: string;
  };
}

export function DialogBox({ open, onClose, mediaDetails }: DialogBoxProps) {
  // Extract year from release_date
  const releaseYear = mediaDetails.release_date ? mediaDetails.release_date.split("-")[0] : "N/A";

  // Handle genres array
  const genreList = mediaDetails.genres?.map((genre) => genre.name).join(", ") || "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div style={{ height: "0px" }}></div>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "53%", padding: "1px", border: "none", marginTop: "-2%" }}>
        {mediaDetails?.backdrop_path && (
          <div style={{ marginBottom: "20px", overflow: "hidden", position: "relative" }}>
            <img
              src={`https://image.tmdb.org/t/p/original${mediaDetails.backdrop_path}`}
              alt={mediaDetails.title}
              className="card-image"
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", maskImage: "linear-gradient(to bottom, transparent, black 10%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, transparent)" }}
            />
            <div className="card-image-overlay" style={{ content: '""', position: "absolute", bottom: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) -40%, rgba(0, 0, 0, 0.2) , rgba(0, 0, 0, 0) 6%)" }}></div>
          </div>
        )}
        <div style={{ textAlign: "center", marginBottom: "5px", marginRight: "85%" }}>
          <Button variant="destructive">Play</Button>
        </div>
        <div style={{ background: "#000000", padding: "20px" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "24px", marginBottom: "10px" }}>{mediaDetails?.title}</DialogTitle>
            <DialogDescription style={{ fontSize: "16px", marginBottom: "20px" }}>
              Release Year: {releaseYear}<br />
              Language: {mediaDetails?.original_language || "N/A"}<br />
              Genres: {genreList}
            </DialogDescription>
          </DialogHeader>
          <div style={{ padding: "10px 0" }}>
            <p style={{ fontSize: "14px" }}>{mediaDetails?.overview}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
