'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BeautyQuote from './beautyQuotes';

type WeatherData = { temp: number; condition: string; icon: string; city: string; };
type Recommendation = { title: string; description: string; image: string; color: string; };

export default function WeatherRecommendation() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchWeather() {
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Lagos`);
      const data = await res.json();
      
      const weatherData = {
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        city: data.location.name,
      };

      const cond = weatherData.condition.toLowerCase();
      let rec: Recommendation;

      if (weatherData.temp >= 30) {
        rec = {
          title: 'Bold & Sun-Kissed',
          description: 'It’s a hot day! Match the heat with vibrant Neons or tropical Corals.',
          image: '/recommend/nail-hot.png',
          color: 'from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20'
        };
      } else if (cond.includes('rain') || cond.includes('drizzle')) {
        rec = {
          title: 'Cool Rain Pastels',
          description: 'The weather is gloomy, but your nails don’t have to be. Try soft Lavenders or Sky Blues.',
          image: '/recommend/nail-rain.jpg',
          color: 'from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-950/20'
        };
      } else {
        rec = {
          title: 'Classic Cozy Tones',
          description: 'Perfect weather for deep Burgundies, Nudes, or sophisticated Earth tones.',
          image: '/recommend/nail-cold2.png',
          color: 'from-rose-50 to-stone-50 dark:from-rose-950/20 dark:to-stone-950/20'
        };
      }

      setWeather(weatherData);
      setRecommendation(rec);
    } catch (err) {
      console.error("Weather fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchWeather(); }, []);

  return (
    <section className={`mt-20 rounded-3xl p-8 md:p-12 transition-all duration-700 bg-gradient-to-br ${recommendation?.color || 'bg-gray-50'}`}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="text-center mb-10">
          <h2 className="text-[#D77A8B] font-bold tracking-widest uppercase text-xs mb-2">Personalized For You</h2>
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white">The Daily Vibe</h1>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center animate-pulse text-gray-400">Curating your style...</div>
        ) : weather && recommendation ? (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            
            {/* Weather Card */}
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-sm text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Forecast in {weather.city}</p>
              <div className="flex flex-col items-center mt-2">
                <img src={weather.icon} alt={weather.condition} className="w-20 h-20" />
                <p className="text-4xl font-light dark:text-white">{weather.temp}°C</p>
                <p className="text-gray-600 dark:text-gray-300 capitalize">{weather.condition}</p>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#1A1A1A]">
              <div className="relative h-56 w-full">
                <Image src={recommendation.image} alt={recommendation.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <h3 className="text-2xl font-bold">{recommendation.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                  "{recommendation.description}"
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      <BeautyQuote />
    </section>
  );
}