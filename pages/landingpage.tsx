"use client";
import React from "react";
import Topnav  from "./nav/nav"
import Banner from "./banner/banner";
import TrendingSection from "./trending-section/trending-section";
import Moviesection from "./movie-section/movie-section";
import TvSection from "./tv-section/tv-section";
import TopRatedSection from "./top-rated-section/top-section";

export  default function Landingpage() {
  return (
    <div>
      <Topnav />
      <Banner />
      <TrendingSection/>
      <Moviesection/>
      <TvSection/>
      <TopRatedSection/>
    </div>
  );
}