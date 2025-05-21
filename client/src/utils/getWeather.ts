// utils/getWeather.ts
export async function getWeather(city: string) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather");
    return res.json();
  }
  