import React from 'react';
import { motion } from 'motion/react';
import { 
  Wind, 
  Navigation, 
  Droplets, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Clock 
} from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherDetails, getWeatherIcon } from '../utils/weatherCodes';

interface CurrentWeatherProps {
  location: { name: string; country: string; admin1?: string };
  weatherData: WeatherData;
  isFahrenheit: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  location,
  weatherData,
  isFahrenheit,
}) => {
  const { current_weather, daily } = weatherData;
  const details = getWeatherDetails(current_weather.weathercode);
  const WeatherIcon = getWeatherIcon(details.iconName);

  // Convert temperature helper
  const formatTemp = (celsius: number) => {
    if (isFahrenheit) {
      const f = (celsius * 9) / 5 + 32;
      return `${Math.round(f)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  // Convert windspeed helper (Open-Meteo returns windspeed in km/h by default)
  const formatWindSpeed = (kmh: number) => {
    if (isFahrenheit) {
      const mph = kmh * 0.621371;
      return `${mph.toFixed(1)} mph`;
    }
    return `${kmh.toFixed(1)} km/h`;
  };

  // Get current date/time representation
  const formatLocalTime = (isoTimeStr: string) => {
    try {
      const date = new Date(isoTimeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoTimeStr;
    }
  };

  const formatLocalDate = (isoTimeStr: string) => {
    try {
      const date = new Date(isoTimeStr);
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return isoTimeStr;
    }
  };

  // High and low for today (index 0)
  const todayMaxTemp = daily.temperature_2m_max[0];
  const todayMinTemp = daily.temperature_2m_min[0];
  const todayPrecip = daily.precipitation_sum[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="current-weather-card"
      className="w-full bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl overflow-hidden"
    >
      {/* Dynamic Header Gradient matching weather state */}
      <div className={`p-6 sm:p-8 bg-gradient-to-br ${details.bgGradientDark} relative overflow-hidden border-b border-[#2D333E]`}>
        {/* Subtle background ambient circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-32 h-32 rounded-full bg-indigo-600/5 blur-lg pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[#94A3B8] font-medium text-xs sm:text-sm uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatLocalDate(current_weather.time)}</span>
            </div>
            
            <h1 id="location-title" className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
              {location.name}
            </h1>
            
            <p className="text-sm sm:text-base text-[#94A3B8] font-medium">
              {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`p-4 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 ${details.iconColor} flex items-center justify-center shrink-0`}>
              <WeatherIcon className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div>
              <div id="current-temp" className="text-4xl sm:text-5.5xl font-black text-white tracking-tighter leading-none">
                {formatTemp(current_weather.temperature)}
              </div>
              <div id="weather-condition-label" className="text-base sm:text-lg font-bold text-blue-400 mt-1.5 leading-none">
                {details.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="p-6 sm:p-8 bg-[#13161C]/50 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* High / Low Temp */}
        <div className="bg-[#1A1D24] p-4 rounded-2xl border border-[#2D333E] shadow-sm flex items-center gap-3.5" id="metric-temp-range">
          <div className="p-2.5 bg-rose-950/30 rounded-xl text-rose-400">
            <ArrowUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-semibold text-[#4B5563] font-sans uppercase tracking-wider">Hi / Lo Today</span>
            <span className="text-sm sm:text-base font-bold text-[#E2E8F0] font-mono">
              {formatTemp(todayMaxTemp)} <span className="text-[#2D333E]">/</span> {formatTemp(todayMinTemp)}
            </span>
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-[#1A1D24] p-4 rounded-2xl border border-[#2D333E] shadow-sm flex items-center gap-3.5" id="metric-precipitation">
          <div className="p-2.5 bg-blue-950/30 rounded-xl text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-semibold text-[#4B5563] font-sans uppercase tracking-wider">Precipitation</span>
            <span className="text-sm sm:text-base font-bold text-[#E2E8F0] font-mono">
              {todayPrecip} mm
            </span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#1A1D24] p-4 rounded-2xl border border-[#2D333E] shadow-sm flex items-center gap-3.5" id="metric-wind-speed">
          <div className="p-2.5 bg-teal-950/30 rounded-xl text-teal-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-semibold text-[#4B5563] font-sans uppercase tracking-wider">Wind Speed</span>
            <span className="text-sm sm:text-base font-bold text-[#E2E8F0] font-mono">
              {formatWindSpeed(current_weather.windspeed)}
            </span>
          </div>
        </div>

        {/* Wind Direction */}
        <div className="bg-[#1A1D24] p-4 rounded-2xl border border-[#2D333E] shadow-sm flex items-center gap-3.5" id="metric-wind-dir">
          <div className="p-2.5 bg-amber-950/30 rounded-xl text-amber-400">
            <Navigation 
              className="w-5 h-5 transition-transform" 
              style={{ transform: `rotate(${current_weather.winddirection}deg)` }} 
            />
          </div>
          <div>
            <span className="block text-[10px] sm:text-xs font-semibold text-[#4B5563] font-sans uppercase tracking-wider">Wind Direction</span>
            <span className="text-sm sm:text-base font-bold text-[#E2E8F0] font-mono">
              {current_weather.winddirection}°
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="px-6 py-4 bg-[#1A1D24] border-t border-[#2D333E] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5563] font-sans">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Local Weather Update: {formatLocalTime(current_weather.time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Station coordinates:</span>
          <span className="font-mono bg-[#13161C] px-2 py-0.5 rounded text-[#94A3B8] border border-[#2D333E]/30">
            {weatherData.latitude.toFixed(4)}°N, {weatherData.longitude.toFixed(4)}°E
          </span>
        </div>
      </div>
    </motion.div>
  );
};
