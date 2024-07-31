import React from "react";
import { Topnav } from "./nav/nav"
import { Banner } from "./banner/banner";
import TrendingSection from "./banner/trending-section/trending-section";

export function Landingpage() {
  return (
    <div>
      <Topnav />
      <Banner />
      <TrendingSection/>
    </div>
  );
}