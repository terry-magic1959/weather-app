// ===============================
// File: src/App.jsx
// ===============================
import React, { useState, useEffect } from 'react';
import { fetchCurrentWeather, fetchWeeklyForecast } from './api/weather';
import WeatherCard from './components/WeatherCard.jsx';
import WeeklyForecast from './components/WeeklyForecast.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import './index.css';

const cities = [
  { name: '宮若市', key: 'Miyawaka' },
  { name: '直方市', key: 'Nogata' }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0].key);
  const [weather, setWeather] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setWeather(null);
    setWeekly(null);
    setError(null);

    fetchCurrentWeather(selectedCity)
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message));

    fetchWeeklyForecast(selectedCity)
      .then((data) => setWeekly(data))
      .catch((err) => setError(err.message));
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
      {/* City Selection */}
      <div className="flex space-x-4 mb-6">
        {cities.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCity(c.key)}
            className={`px-4 py-2 rounded-full font-medium ${
              selectedCity === c.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 shadow'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Current Weather with Advice */}
      {error && <p className="text-red-500 mb-4">エラー: {error}</p>}
      {!weather && !error && (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-600 text-lg">読み込み中…</p>
        </div>
      )}
      {weather && (
        <div className="flex items-center justify-center space-x-8 mb-8 w-full max-w-3xl">
          {/* Left: Weather Icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="w-24 h-24"
          />

          {/* Center: Weather Card */}
          <WeatherCard city={selectedCity} data={weather} />

          {/* Right: Advice Panel */}
          <div className="bg-white p-4 rounded-2xl shadow max-w-xs text-sm text-gray-700">
            <h4 className="font-semibold mb-2">服装＆風速アドバイス</h4>
            {/* Clothing Advice */}
            <p>
              {weather.temp >= 25
                ? '今日は暑いので、軽装（半袖や短パン）がおすすめです。'
                : weather.temp >= 18
                ? '過ごしやすい気温です。長袖シャツ＋軽い羽織ものが◎。'
                : weather.temp >= 10
                ? '少し肌寒いので、ジャケットやパーカーを用意しましょう。'
                : '冷え込みます。コートなど暖かい服装でお出かけを。'}
            </p>
            {/* Wind Advice */}
            <p className="mt-2">
              {weather.windSpeed >= 10
                ? '風が強いので、帽子や飛ばされやすいものに注意して。'
                : weather.windSpeed >= 5
                ? 'やや風があります。ヘアスタイルや運転に注意。'
                : '風は穏やかです。'}
            </p>
          </div>
        </div>
      )}

      {/* Forecasts */}
      {weekly && <WeeklyForecast data={weekly} />}
      {weather && <HourlyForecast city={selectedCity} hours={24} />}
    </div>
  );
}

