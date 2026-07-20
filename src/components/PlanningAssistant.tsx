import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Umbrella, 
  Sun, 
  Wind, 
  ShieldAlert, 
  Activity, 
  Shirt, 
  CheckCircle2, 
  CloudRain,
  Snowflake,
  Flame,
  Cloudy
} from 'lucide-react';
import { DailyForecast, CurrentWeather } from '../types';
import { getWeatherDetails } from '../utils/weatherCodes';

interface PlanningAssistantProps {
  currentWeather: CurrentWeather;
  dailyData: DailyForecast;
  locationName: string;
}

interface Recommendation {
  category: 'safety' | 'clothing' | 'activities';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeColor: string;
  bgColor: string;
}

export const PlanningAssistant: React.FC<PlanningAssistantProps> = ({
  currentWeather,
  dailyData,
  locationName,
}) => {
  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_sum,
    windspeed_10m_max,
  } = dailyData;

  const generateRecommendations = (): Recommendation[] => {
    const list: Recommendation[] = [];

    // --- 1. SAFETY & CRITICAL ADVISORIES ---
    // Check extreme wind speed
    const maxWind = Math.max(...windspeed_10m_max);
    if (maxWind > 40) {
      list.push({
        category: 'safety',
        title: 'High Wind Warning',
        description: `Secure loose light outdoor items (patio cushions, flower pots). Wind speeds could reach a forceful ${maxWind.toFixed(0)} km/h. Avoid parking under high trees.`,
        icon: Wind,
        badgeColor: 'bg-amber-950/40 text-amber-400 border-amber-900/40',
        bgColor: 'bg-[#1E1912]/50 border-amber-900/20'
      });
    }

    // Check extreme heat
    const maxTemp = Math.max(...temperature_2m_max);
    if (maxTemp > 34) {
      list.push({
        category: 'safety',
        title: 'Extreme Heat Advisory',
        description: `Temperatures are expected to spike to a scorching ${maxTemp.toFixed(0)}°C. Stay hydrated, avoid heavy physical exertion in mid-afternoon, and remain in shaded or air-conditioned environments.`,
        icon: Flame,
        badgeColor: 'bg-rose-950/40 text-rose-400 border-rose-900/40',
        bgColor: 'bg-[#241316]/50 border-rose-900/20'
      });
    }

    // Check freezing / ice hazard
    const minTemp = Math.min(...temperature_2m_min);
    if (minTemp <= 0) {
      list.push({
        category: 'safety',
        title: 'Freezing Hazard Watch',
        description: `Freezing temperatures detected (low of ${minTemp.toFixed(0)}°C). Frost or black ice may accumulate on roads and sidewalks. Protect sensitive garden plants.`,
        icon: Snowflake,
        badgeColor: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40',
        bgColor: 'bg-[#131525]/50 border-indigo-900/20'
      });
    }

    // Check lightning / severe storm codes (95, 96, 99)
    const stormDays = time
      .map((t, i) => (weathercode[i] >= 95 ? i : -1))
      .filter((i) => i !== -1);
    
    if (stormDays.length > 0) {
      const dayNames = stormDays.map(i => {
        const d = new Date(time[i]);
        return d.toLocaleDateString([], { weekday: 'long' });
      });
      list.push({
        category: 'safety',
        title: 'Thunderstorm Watch',
        description: `Active lightning and severe weather forecasted for ${dayNames.join(', ')}. Avoid staying near open fields, high objects, or metallic structures during the lightning periods.`,
        icon: ShieldAlert,
        badgeColor: 'bg-red-950/40 text-red-400 border-red-900/40',
        bgColor: 'bg-[#241215]/50 border-red-900/20'
      });
    }


    // --- 2. CLOTHING RECOMMENDATIONS ---
    // Check precipitation/rain
    const totalRainDays = precipitation_sum.filter((p) => p > 1.5).length;
    const currentRainy = currentWeather.weathercode >= 51 && currentWeather.weathercode <= 82;

    if (currentRainy) {
      list.push({
        category: 'clothing',
        title: 'Wet Weather Gear',
        description: `It is currently raining in ${locationName}. Wear a high-quality waterproof jacket, sturdy waterproof footwear, and keep your umbrella handy.`,
        icon: Umbrella,
        badgeColor: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
        bgColor: 'bg-[#131A26]/50 border-blue-900/20'
      });
    } else if (totalRainDays > 2) {
      list.push({
        category: 'clothing',
        title: 'Frequent Showers Expected',
        description: `Wet weather is forecasted on ${totalRainDays} days this week. We highly recommend carrying a compact umbrella or wearing breathable raincoats.`,
        icon: CloudRain,
        badgeColor: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
        bgColor: 'bg-[#131A26]/50 border-blue-900/20'
      });
    }

    // Warm clothing / sunscreen check
    if (currentWeather.temperature > 25 && currentWeather.weathercode <= 2) {
      list.push({
        category: 'clothing',
        title: 'Light & Protective Clothing',
        description: 'Clear warm skies. Opt for loose cotton or linen fabrics. A wide-brimmed sun hat, polarized sunglasses, and a generous layer of SPF 30+ sunscreen are highly advised.',
        icon: Sun,
        badgeColor: 'bg-amber-950/40 text-amber-400 border-amber-900/40',
        bgColor: 'bg-[#1E1912]/40 border-amber-900/20'
      });
    } else if (currentWeather.temperature < 12) {
      list.push({
        category: 'clothing',
        title: 'Thermal Layering Advised',
        description: `Chilly weather (${currentWeather.temperature.toFixed(0)}°C). Put on a thick windproof coat, heavy sweater, or scarf to conserve body heat when traveling.`,
        icon: Shirt,
        badgeColor: 'bg-[#1A1D24] text-[#94A3B8] border-[#2D333E]',
        bgColor: 'bg-[#13161C]/50 border-[#2D333E]/50'
      });
    } else {
      // Mild weather layering
      list.push({
        category: 'clothing',
        title: 'Flexible Layering Comfort',
        description: 'Pleasant, moderate temperatures. A light denim jacket, cardigan, or simple long-sleeve tee is ideal to stay comfortable throughout the shifting diurnal temperatures.',
        icon: Shirt,
        badgeColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
        bgColor: 'bg-[#11241A]/40 border-emerald-900/20'
      });
    }


    // --- 3. OUTDOOR & LIFESTYLE ACTIVITIES ---
    // Perfect day search
    const perfectDayIndices = time
      .map((_, i) => {
        const isWarm = temperature_2m_max[i] >= 18 && temperature_2m_max[i] <= 27;
        const isDry = precipitation_sum[i] === 0;
        const isClear = weathercode[i] <= 2;
        const isMildWind = windspeed_10m_max[i] < 20;
        return isWarm && isDry && isClear && isMildWind ? i : -1;
      })
      .filter((i) => i !== -1);

    if (perfectDayIndices.length > 0) {
      const dayNames = perfectDayIndices.map(i => {
        const d = new Date(time[i]);
        return d.toLocaleDateString([], { weekday: 'long' });
      });
      list.push({
        category: 'activities',
        title: 'Premium Outdoor Activity Windows',
        description: `${dayNames.join(', ')} offer gold-standard conditions! Absolutely perfect for long distance trail running, bicycle rides, picnics, landscape photography, or outdoor dining.`,
        icon: Activity,
        badgeColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
        bgColor: 'bg-[#11241A]/40 border-emerald-900/20'
      });
    } else {
      // Alternative indoor/outdoor check
      const cloudyWetDays = time
        .map((_, i) => (precipitation_sum[i] > 4 || weathercode[i] >= 3 ? i : -1))
        .filter((i) => i !== -1);

      if (cloudyWetDays.length > 4) {
        list.push({
          category: 'activities',
          title: 'Indoor Leisure Recommended',
          description: 'Sustained cloudy, damp, or drizzly conditions this week. This is the perfect excuse for cozy indoor pursuits: museum tours, gallery browsing, movie nights, or starting a new book.',
          icon: Cloudy,
          badgeColor: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40',
          bgColor: 'bg-[#131525]/40 border-indigo-900/20'
        });
      } else {
        list.push({
          category: 'activities',
          title: 'Dynamic Outdoor Schedule',
          description: 'The weather remains highly dynamic but generally playable. Keep a flexible schedule and utilize dry mornings or clear intervals for walks, running, or gardening.',
          icon: Activity,
          badgeColor: 'bg-sky-950/40 text-sky-400 border-sky-900/40',
          bgColor: 'bg-[#131A26]/40 border-sky-900/20'
        });
      }
    }

    return list;
  };

  const recommendations = generateRecommendations();

  return (
    <div id="planning-assistant-card" className="bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl p-6 sm:p-8">
      {/* Title block with sparkles indicator */}
      <div className="flex items-center gap-2.5 border-b border-[#2D333E] pb-5 mb-6">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Smart Planning Assistant
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium font-sans mt-0.5">
            Personalized lifestyle suggestions and advisories customized for current forecast models
          </p>
        </div>
      </div>

      {/* Recs Container */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const RecIcon = rec.icon;
          return (
            <motion.div
              key={index}
              id={`rec-item-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className={`p-4 sm:p-5 rounded-2xl border ${rec.bgColor} flex items-start gap-4 transition-all hover:translate-x-1 duration-150`}
            >
              {/* Left Column - Icon frame */}
              <div className="p-2.5 bg-[#13161C] border border-[#2D333E] rounded-xl shadow-inner text-[#94A3B8] shrink-0">
                <RecIcon className="w-5 h-5" />
              </div>

              {/* Right Column - Title, Badge, Description */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#E2E8F0] font-sans leading-tight">
                    {rec.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${rec.badgeColor}`}>
                    {rec.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans font-medium">
                  {rec.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust disclaimer */}
      <div className="mt-6 pt-5 border-t border-[#2D333E] flex items-center justify-between text-[11px] text-[#4B5563] font-sans">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Calculated using WMO meteorological standards.</span>
        </span>
        <span className="italic">Data updated in real-time</span>
      </div>
    </div>
  );
};
