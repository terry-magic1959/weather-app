
// src/components/WeeklyForecast.jsx
import React from 'react';

/**
 * data: fetchWeeklyForecast で取得した配列
 */
export default function WeeklyForecast({ data }) {
  // 天気に応じた背景色マッピング
  const getBg = (desc) => {
    if (desc.includes('雨')) return 'bg-blue-200';
    if (desc.includes('雲')) return 'bg-gray-200';
    if (desc.includes('晴')) return 'bg-yellow-200';
    return 'bg-white';
  };

  return (
    <div className="w-full overflow-x-auto mt-8">
      <div className="flex space-x-4 px-2">
        {data.map(day => {
          const date = new Date(day.dt * 1000);
          const formatted = new Intl.DateTimeFormat('ja-JP', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short'
          }).format(date);
          const bgColor = getBg(day.description);

          return (
            <div
              key={day.dt}
              className={`${bgColor} flex-shrink-0 w-32 rounded-2xl shadow-lg p-3 text-center`}
            >
              <p className="text-sm font-semibold mb-1">{formatted}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-12 h-12 mx-auto mb-1"
              />
              <p className="text-base font-bold">
                {day.temp.max}°<span className="text-sm">/{day.temp.min}°</span>
              </p>
              <p className="text-xs capitalize mb-1">{day.description}</p>
              <p className="text-blue-600 text-xs">☔ {day.rainChance}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
