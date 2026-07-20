import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Wind, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecast } from '../types';
import { getWeatherDetails, getWeatherIcon } from '../utils/weatherCodes';

interface ForecastGridProps {
  dailyData: DailyForecast;
  isFahrenheit: boolean;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  dailyData,
  isFahrenheit,
}) => {
  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_sum,
    windspeed_10m_max,
  } = dailyData;

  const formatTemp = (celsius: number) => {
    if (isFahrenheit) {
      const f = (celsius * 9) / 5 + 32;
      return `${Math.round(f)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const formatWindSpeed = (kmh: number) => {
    if (isFahrenheit) {
      const mph = kmh * 0.621371;
      return `${Math.round(mph)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  const getDayName = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // Check if it's today
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      }
      return date.toLocaleDateString([], { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Create list of 7 days
  const indices = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div id="forecast-section" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>7-Day Weather Forecast</span>
          <span className="text-[10px] sm:text-xs bg-[#1A1D24] text-[#94A3B8] border border-[#2D333E] py-1 px-2.5 rounded-full font-semibold font-sans">
            Weekly outlook
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {indices.map((idx) => {
          const dateStr = time[idx];
          const code = weathercode[idx];
          const maxTemp = temperature_2m_max[idx];
          const minTemp = temperature_2m_min[idx];
          const precip = precipitation_sum[idx];
          const wind = windspeed_10m_max[idx];

          const details = getWeatherDetails(code);
          const WeatherIcon = getWeatherIcon(details.iconName);

          return (
            <motion.div
              key={dateStr}
              id={`forecast-card-day-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="bg-[#1A1D24] rounded-2xl border border-[#2D333E] shadow-xl p-4 text-center flex flex-col justify-between transition-all hover:border-blue-500/40"
            >
              {/* Day & Date Labels */}
              <div>
                <span className="block text-sm font-extrabold text-[#E2E8F0] font-sans tracking-tight">
                  {getDayName(dateStr)}
                </span>
                <span className="block text-[11px] font-medium text-[#4B5563] font-sans mt-0.5">
                  {formatDateLabel(dateStr)}
                </span>
              </div>

              {/* Weather Icon Frame */}
              <div className="my-3 flex justify-center">
                <div className={`p-2.5 bg-[#13161C] rounded-xl ${details.iconColor} flex items-center justify-center border border-[#2D333E]/50 shadow-inner`}>
                  <WeatherIcon className="w-6 h-6" />
                </div>
              </div>

              {/* Weather Description text (hidden on small grid size, shown as subtitle) */}
              <div className="text-[10px] font-bold text-[#94A3B8] line-clamp-1 mb-2.5 leading-none">
                {details.label}
              </div>

              {/* Temperature Range */}
              <div className="flex items-center justify-center gap-2.5 py-1 px-1.5 bg-[#13161C] rounded-xl mb-3 border border-[#2D333E]/20">
                <div className="flex items-center text-white">
                  <ArrowUp className="w-3 h-3 text-rose-500 mr-0.5" />
                  <span className="text-xs font-bold font-mono">
                    {formatTemp(maxTemp).replace(/°[CF]/, '')}
                  </span>
                </div>
                <div className="flex items-center text-[#94A3B8]">
                  <ArrowDown className="w-3 h-3 text-blue-500 mr-0.5" />
                  <span className="text-xs font-bold font-mono">
                    {formatTemp(minTemp).replace(/°[CF]/, '')}
                  </span>
                </div>
              </div>

              {/* Secondary Details (Precip & Wind) */}
              <div className="space-y-1.5 pt-2 border-t border-[#2D333E]/60 text-[10px] font-sans">
                {/* Precip */}
                <div className="flex items-center justify-between text-[#4B5563]">
                  <span className="flex items-center gap-0.5 font-medium text-[#94A3B8]">
                    <Droplets className="w-3 h-3 text-blue-400" /> Rain
                  </span>
                  <span className="font-semibold text-[#E2E8F0] font-mono">
                    {precip > 0 ? `${precip.toFixed(1)}mm` : '0'}
                  </span>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between text-[#4B5563]">
                  <span className="flex items-center gap-0.5 font-medium text-[#94A3B8]">
                    <Wind className="w-3 h-3 text-teal-400" /> Wind
                  </span>
                  <span className="font-semibold text-[#E2E8F0] font-mono">
                    {formatWindSpeed(wind)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
