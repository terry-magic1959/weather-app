// src/components/WeatherCard.jsx
export default function WeatherCard({ city, data }) {
    const { temp, description, icon, rainChance } = data;
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs text-center">
        <h2 className="text-2xl font-bold mb-2">{city} の天気</h2>
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          className="mx-auto"
        />
        <p className="text-4xl font-semibold">{temp}°C</p>
        <p className="capitalize">{description}</p>
        <p className="mt-2 text-blue-500">降水確率 {rainChance}%</p>
      </div>
    );
  }
  