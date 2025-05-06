// ===============================
// File: src/api/weather.js
// ===============================
export async function fetchCurrentWeather(
    city = import.meta.env.VITE_DEFAULT_CITY
  ) {
    const key = import.meta.env.VITE_WEATHER_API_KEY;
    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${city}&units=metric&lang=ja&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`天気情報の取得に失敗しました（HTTP ${res.status}）`);
    }
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      rainChance: Math.round((data.rain?.['1h'] ?? 0) * 100),
      windSpeed: data.wind?.speed ?? 0,
    };
  }
  
  export async function fetchWeeklyForecast(
    city = import.meta.env.VITE_DEFAULT_CITY
  ) {
    const key = import.meta.env.VITE_WEATHER_API_KEY;
    // 座標取得
    const coordRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?` +
        `q=${city}&appid=${key}`
    );
    if (!coordRes.ok) {
      throw new Error(`座標取得に失敗しました（HTTP ${coordRes.status}）`);
    }
    const { coord: { lat, lon } } = await coordRes.json();
    // One Call API v3.0
    const onecallRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?` +
        `lat=${lat}&lon=${lon}` +
        `&exclude=minutely,hourly,alerts&units=metric&lang=ja&appid=${key}`
    );
    if (!onecallRes.ok) {
      throw new Error(`週間予報取得に失敗しました（HTTP ${onecallRes.status}）`);
    }
    const { daily } = await onecallRes.json();
    return daily.slice(0, 7).map(day => ({
      dt: day.dt,
      temp: { min: Math.round(day.temp.min), max: Math.round(day.temp.max) },
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      rainChance: Math.round((day.pop ?? 0) * 100),
    }));
  }
  
  export async function fetchHourlyForecast(
    city = import.meta.env.VITE_DEFAULT_CITY,
    hours = 24
  ) {
    const key = import.meta.env.VITE_WEATHER_API_KEY;
    // 座標取得
    const coordRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?` +
        `q=${city}&appid=${key}`
    );
    if (!coordRes.ok) {
      throw new Error(`座標取得に失敗しました（HTTP ${coordRes.status}）`);
    }
    const { coord: { lat, lon } } = await coordRes.json();
    // One Call API hourly
    try {
      const onecallRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?` +
          `lat=${lat}&lon=${lon}` +
          `&exclude=current,minutely,daily,alerts&units=metric&lang=ja&appid=${key}`
      );
      if (!onecallRes.ok) throw new Error();
      const { hourly } = await onecallRes.json();
      return hourly.slice(0, hours).map(h => ({
        dt: h.dt,
        temp: Math.round(h.temp),
        rainChance: Math.round((h.pop ?? 0) * 100),
        icon: h.weather[0].icon,
      }));
    } catch {
      // フォールバック: 3h予報
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?` +
          `q=${city}&units=metric&lang=ja&appid=${key}`
      );
      if (!forecastRes.ok) {
        throw new Error(`3h予報取得に失敗しました（HTTP ${forecastRes.status}）`);
      }
      const json = await forecastRes.json();
      return json.list.slice(0, Math.ceil(hours / 3)).map(item => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        rainChance: Math.round((item.pop ?? 0) * 100),
        icon: item.weather[0].icon,
      }));
    }
  }