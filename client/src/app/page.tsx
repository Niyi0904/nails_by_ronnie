"use client"
import { useAppDispatch } from "@/hooks/useReduxHook";
import { setUser } from "@/redux/features/authSlice";
import { AppState } from "../redux/store";
import { useEffect } from "react";
import Herosection from "@/components/herosection";
import OurServices from "@/components/ourServices";
import WeatherRecommendation from "@/components/weatherRecommendation";
import ShopSection from "@/components/shop";
import Header from "@/components/header.component";
import Footer from "@/components/footer";

export default function Home() {
  const dispatch = useAppDispatch();
  
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('https://dummyjson.com/products/category/jewelery');

      const res = await data.json();
      console.log(res);
    }
    const localuser = localStorage.getItem('user');

    if (localuser) {
      const user = JSON.parse(localuser);

      dispatch(setUser(user));
      console.log(user);
    }

    fetchData();
  }, []);
  
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
