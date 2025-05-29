"use client"

import Herosection from "@/components/herosection";
import OurServices from "@/components/ourServices";
import WeatherRecommendation from "@/components/weatherRecommendation";
import ShopSection from "@/components/shop";
import Header from "@/components/header.component";
import Footer from "@/components/footer";

export default function Home() {
  
  
  return (
    <div className="w-full min-h-screen">
      <Header/>
      <div className="relative mx-[5%] top-16">
        <Herosection/>
        <OurServices/>
        <WeatherRecommendation/>
        <ShopSection/>
      </div>
      <Footer/>
    </div>
  );
}
