// src/api/weather.js
export async function fetchCurrentWeather(city = import.meta.env.VITE_DEFAULT_CITY) {
    const key = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('天気情報の取得に失敗しました');
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      rainChance: Math.round((data.rain?.['1h'] ?? 0) * 100), 
    };
  }
  