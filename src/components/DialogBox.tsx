import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    description?: string;
  };
  onPlayClick: () => void;
}

export function DialogBox({ open, onClose, mediaDetails, onPlayClick }: DialogBoxProps) {
  const releaseYear = mediaDetails.release_date ? mediaDetails.release_date.split("-")[0] : "N/A";
  const genreList = mediaDetails.genres?.map((genre) => genre.name).join(", ") || "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div style={{ height: "0px" }}></div>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "50%", padding: "0", border: "none", marginTop: "-2%" }}>
        {mediaDetails?.backdrop_path && (
          <div style={{ overflow: "hidden", position: "relative", marginBottom: "0" }}>
            <Image
              src={`https://image.tmdb.org/t/p/original${mediaDetails.backdrop_path}`}
              alt={mediaDetails.title || ""}
              layout="responsive"
              width={800}
              height={450}
              className="card-image"
              style={{ objectFit: "cover", position: "relative", maskImage: "linear-gradient(to bottom, transparent, black 10%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, transparent)" }}
            />
            <div className="card-image-overlay" style={{ content: '""', position: "absolute", bottom: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) -40%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0) 6%)" }}></div>
          </div>
        )}
        <div style={{ marginLeft:"2%",marginBottom: "5px" }}>
          <Button variant="destructive" onClick={onPlayClick}>Play</Button>
        </div>
        <div style={{ background: "#000000", padding: "15px" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "20px", marginBottom: "10px" }}>{mediaDetails?.title}</DialogTitle>
            <DialogDescription style={{ fontSize: "14px", marginBottom: "15px", color: "#ccc" }}>
              Release Year: {releaseYear}<br />
              Language: {mediaDetails?.original_language || "N/A"}<br />
              Genres: {genreList}
            </DialogDescription>
          </DialogHeader>
          <div style={{ padding: "10px 0" }}>
            <div style={{ 
              maxHeight: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "3",
              color: "#ccc"
            }}>
              <p style={{ fontSize: "12px", margin: "0" }}>{mediaDetails?.overview || mediaDetails?.description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
