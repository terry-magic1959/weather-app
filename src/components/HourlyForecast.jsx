// src/components/HourlyForecast.jsx
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { fetchHourlyForecast } from '../api/weather';

const CustomTick = ({ x, y, payload }) => {
  const time = payload.value;
  const icon = payload.payload?.icon;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fontSize={12} fill="#333">
        {time}
      </text>
      {icon && (
        <image
          href={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          x={-12}
          y={18}
          height={24}
          width={24}
        />
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const tempObj = payload.find(p => p.dataKey === 'temp');
    const rainObj = payload.find(p => p.dataKey === 'rain');
    const icon = payload[0].payload.icon;
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="font-bold mb-1">{label}</p>
        <div className="flex items-center">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
            className="w-8 h-8"
          />
          <div className="ml-2">
            <p>気温: {tempObj.value}°C</p>
            <p>降水確率: {rainObj.value}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function HourlyForecast({ city, hours = 24 }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHourlyForecast(city, hours)
      .then(arr => {
        const chartData = arr.map(item => {
          const date = new Date(item.dt * 1000);
          return {
            time: `${date.getHours()}時`,
            temp: item.temp,
            rain: item.rainChance,
            icon: item.icon,
          };
        });
        setData(chartData);
      })
      .catch(err => setError(err.message));
  }, [city, hours]);

  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (!data.length) return <p className="text-gray-600">読み込み中…</p>;

  return (
    <div className="w-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-2xl shadow-lg p-4 my-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        {city} の次 {hours}時間予報
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 20, left: 5, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="time"
            tick={<CustomTick />}
            height={60}
            interval={Math.floor(data.length / 8)}
            axisLine={{ stroke: '#ccc' }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis
            yAxisId="left"
            unit="°C"
            stroke="#ef4444"
            domain={[dataMin => dataMin - 5, dataMax => dataMax + 5]}
            tick={{ fill: '#333' }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            unit="%"
            stroke="#3b82f6"
            domain={[0, 100]}
            tick={{ fill: '#333' }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={{ stroke: '#ccc' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            payload={[
              { value: '気温', type: 'line', color: '#ef4444' },
              { value: '降水確率', type: 'square', color: '#3b82f6' }
            ]}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="rain"
            name="降水確率"
            unit="%"
            fill="rgba(59,130,246,0.3)"
            stroke="transparent"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temp"
            name="気温"
            unit="°C"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

