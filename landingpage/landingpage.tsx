import React from "react";
import { Topnav } from "./nav/nav"
import { Banner } from "./banner/banner";
import TrendingSection from "./trending-section/trending-section";
import Moviesection from "./movie-section/movie-section";
import TvSection from "./tv-section/tv-section";

export function Landingpage() {
  return (
    <div>
      <Topnav />
      <Banner />
      <TrendingSection/>
      <Moviesection/>
      <TvSection/>
    </div>
  );
}