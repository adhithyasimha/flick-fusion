"use client";

import { Button } from "@/components/ui/button";
import "./nav.css"

import React from "react";

import { Input } from "@/components/ui/input";

export function Topnav() {
  return (
    <div>
      <div>
        <nav className="relative z-10 navbar">
          <div className="logo">🎬</div>
          <Input className="search-bar" placeholder="Search..."></Input>
          <Button variant="destructive" className="logout-button">
            Logout
          </Button>
        </nav>
      </div>
    </div>
  );
}