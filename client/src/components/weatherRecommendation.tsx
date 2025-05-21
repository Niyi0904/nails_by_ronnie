'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BeautyQuote from './beautyQuotes';

type WeatherData = {
  temp: number;
  condition: string;
  icon: string;
  city: string;
};

type Recommendation = {
  title: string;
  description: string;
  image: string;
};

export default function WeatherRecommendation() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<any>(null);

  async function fetchWeather() {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Lagos`
      );
      const data = await res.json();
      const weatherData: WeatherData = {
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        city: data.location.name,
      };
      setWeather(weatherData);

      // Simple logic (you can improve this)
      const recs = { 
        Hot: {
          title: 'Go Bold with Neon!',
          description: 'The heat is on—go bright with neon or tropical shades.',
          image: '/recommend/nail-hot.png',
        },
        Rain: {
          title: 'Pastel Mood',
          description: 'Match the rain with calm pastel nails.',
          image: '/recommend/nail-rain.jpg',
        },
        Cold: {
          title: 'Cozy Elegance',
          description: 'Try deep reds or muted tones for the cool weather.',
          image: '/recommend/nail-cold2.png',
        },
      };

      if (weatherData.temp >= 30) setRecommendation(recs.Hot);
      else if (weatherData.condition.toLowerCase().includes('rain'))
        setRecommendation(recs.Rain);
      else setRecommendation(recs.Cold);
    } catch (err) {
      console.error(err);
      setError(err)
    }
  }
  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <section className="mt-20 bg-[#FCE4EC] dark:bg-[#2A262F] py-16 px-4 md:px-16 rounded-xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Today's Nail Recommendation
        </h2>

        {weather && recommendation ? (
          <div className="grid md:grid-cols-2 items-center gap-10">
            {/* Weather Info */}
            <div className="bg-white dark:bg-[#2E2E2E] p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2 text-[#E11D48] dark:text-[#F9D8DA]">
                Weather in {weather.city}
              </h3>
              <div className="flex justify-center items-center gap-4">
                <img src={weather.icon} alt={weather.condition} />
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  {weather.temp}°C – {weather.condition}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="text-left max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-[#E11D48] dark:text-[#F9D8DA] mb-2">
                {recommendation.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {recommendation.description}
              </p>
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={recommendation.image}
                  alt={recommendation.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mt-4">{error ? 'Loading recommendation...' : 'Unable to fetch nail recomendation'}</p>
        )}
      </motion.div>

      <BeautyQuote/>
    </section>
  );
}
