// utils/getWeather.ts
export async function getWeather(city: string) {
    const apiKey = '7476472420b946328d2140955251305';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather");
    return res.json();
  }
  