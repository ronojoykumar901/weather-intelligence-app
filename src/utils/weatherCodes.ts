import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Snowflake,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { WeatherCodeDetails } from '../types';

export const weatherCodeMap: Record<number, WeatherCodeDetails> = {
  0: {
    label: "Clear Sky",
    iconName: "Sun",
    bgGradient: "from-amber-400 to-orange-500",
    bgGradientDark: "from-amber-500/20 to-orange-600/20",
    textColor: "text-amber-950",
    iconColor: "text-amber-500"
  },
  1: {
    label: "Mainly Clear",
    iconName: "CloudSun",
    bgGradient: "from-sky-300 to-amber-200",
    bgGradientDark: "from-sky-500/10 to-amber-500/10",
    textColor: "text-sky-950",
    iconColor: "text-amber-500"
  },
  2: {
    label: "Partly Cloudy",
    iconName: "CloudSun",
    bgGradient: "from-sky-200 to-slate-200",
    bgGradientDark: "from-sky-500/10 to-slate-500/10",
    textColor: "text-slate-800",
    iconColor: "text-sky-500"
  },
  3: {
    label: "Overcast",
    iconName: "Cloud",
    bgGradient: "from-slate-300 to-slate-400",
    bgGradientDark: "from-slate-500/20 to-slate-600/20",
    textColor: "text-slate-900",
    iconColor: "text-slate-600"
  },
  45: {
    label: "Foggy",
    iconName: "CloudFog",
    bgGradient: "from-zinc-200 to-slate-300",
    bgGradientDark: "from-zinc-500/25 to-slate-600/25",
    textColor: "text-slate-800",
    iconColor: "text-slate-500"
  },
  48: {
    label: "Depositing Rime Fog",
    iconName: "CloudFog",
    bgGradient: "from-zinc-300 to-slate-400",
    bgGradientDark: "from-zinc-600/20 to-slate-700/20",
    textColor: "text-slate-900",
    iconColor: "text-sky-400"
  },
  51: {
    label: "Light Drizzle",
    iconName: "CloudDrizzle",
    bgGradient: "from-sky-100 to-blue-200",
    bgGradientDark: "from-sky-500/15 to-blue-500/15",
    textColor: "text-blue-900",
    iconColor: "text-blue-400"
  },
  53: {
    label: "Moderate Drizzle",
    iconName: "CloudDrizzle",
    bgGradient: "from-sky-200 to-blue-300",
    bgGradientDark: "from-sky-500/20 to-blue-500/20",
    textColor: "text-blue-950",
    iconColor: "text-blue-500"
  },
  55: {
    label: "Dense Drizzle",
    iconName: "CloudDrizzle",
    bgGradient: "from-sky-300 to-blue-400",
    bgGradientDark: "from-sky-600/20 to-blue-600/20",
    textColor: "text-blue-950",
    iconColor: "text-blue-600"
  },
  56: {
    label: "Light Freezing Drizzle",
    iconName: "CloudSnow",
    bgGradient: "from-indigo-100 to-sky-200",
    bgGradientDark: "from-indigo-500/15 to-sky-500/15",
    textColor: "text-indigo-900",
    iconColor: "text-sky-300"
  },
  57: {
    label: "Dense Freezing Drizzle",
    iconName: "CloudSnow",
    bgGradient: "from-indigo-200 to-sky-300",
    bgGradientDark: "from-indigo-500/20 to-sky-500/20",
    textColor: "text-indigo-950",
    iconColor: "text-sky-400"
  },
  61: {
    label: "Slight Rain",
    iconName: "CloudRain",
    bgGradient: "from-blue-200 to-indigo-300",
    bgGradientDark: "from-blue-500/15 to-indigo-500/15",
    textColor: "text-blue-900",
    iconColor: "text-blue-500"
  },
  63: {
    label: "Moderate Rain",
    iconName: "CloudRain",
    bgGradient: "from-blue-300 to-indigo-400",
    bgGradientDark: "from-blue-500/20 to-indigo-500/20",
    textColor: "text-blue-950",
    iconColor: "text-blue-600"
  },
  65: {
    label: "Heavy Rain",
    iconName: "CloudRain",
    bgGradient: "from-blue-400 to-indigo-600",
    bgGradientDark: "from-blue-600/25 to-indigo-700/25",
    textColor: "text-indigo-950",
    iconColor: "text-indigo-600"
  },
  66: {
    label: "Light Freezing Rain",
    iconName: "CloudSnow",
    bgGradient: "from-blue-100 to-indigo-200",
    bgGradientDark: "from-blue-500/15 to-indigo-500/15",
    textColor: "text-indigo-900",
    iconColor: "text-sky-400"
  },
  67: {
    label: "Heavy Freezing Rain",
    iconName: "CloudSnow",
    bgGradient: "from-blue-200 to-indigo-400",
    bgGradientDark: "from-blue-500/20 to-indigo-600/20",
    textColor: "text-indigo-950",
    iconColor: "text-sky-500"
  },
  71: {
    label: "Slight Snowfall",
    iconName: "Snowflake",
    bgGradient: "from-indigo-100 to-slate-200",
    bgGradientDark: "from-indigo-500/10 to-slate-500/10",
    textColor: "text-indigo-900",
    iconColor: "text-indigo-400"
  },
  73: {
    label: "Moderate Snowfall",
    iconName: "Snowflake",
    bgGradient: "from-indigo-200 to-slate-300",
    bgGradientDark: "from-indigo-500/15 to-slate-500/15",
    textColor: "text-indigo-950",
    iconColor: "text-indigo-500"
  },
  75: {
    label: "Heavy Snowfall",
    iconName: "Snowflake",
    bgGradient: "from-indigo-300 to-blue-300",
    bgGradientDark: "from-indigo-500/20 to-blue-500/20",
    textColor: "text-indigo-950",
    iconColor: "text-blue-600"
  },
  77: {
    label: "Snow Grains",
    iconName: "Snowflake",
    bgGradient: "from-slate-100 to-slate-200",
    bgGradientDark: "from-slate-500/10 to-slate-500/10",
    textColor: "text-slate-800",
    iconColor: "text-slate-500"
  },
  80: {
    label: "Slight Rain Showers",
    iconName: "CloudRain",
    bgGradient: "from-sky-200 to-indigo-300",
    bgGradientDark: "from-sky-500/15 to-indigo-500/15",
    textColor: "text-indigo-900",
    iconColor: "text-sky-600"
  },
  81: {
    label: "Moderate Rain Showers",
    iconName: "CloudRain",
    bgGradient: "from-sky-300 to-indigo-400",
    bgGradientDark: "from-sky-500/20 to-indigo-500/20",
    textColor: "text-indigo-950",
    iconColor: "text-blue-500"
  },
  82: {
    label: "Violent Rain Showers",
    iconName: "CloudRain",
    bgGradient: "from-blue-400 to-indigo-800",
    bgGradientDark: "from-blue-600/30 to-indigo-900/30",
    textColor: "text-blue-950",
    iconColor: "text-indigo-700"
  },
  85: {
    label: "Slight Snow Showers",
    iconName: "CloudSnow",
    bgGradient: "from-indigo-100 to-blue-100",
    bgGradientDark: "from-indigo-500/10 to-blue-500/10",
    textColor: "text-indigo-900",
    iconColor: "text-indigo-400"
  },
  86: {
    label: "Heavy Snow Showers",
    iconName: "CloudSnow",
    bgGradient: "from-indigo-200 to-blue-300",
    bgGradientDark: "from-indigo-500/20 to-blue-500/20",
    textColor: "text-indigo-950",
    iconColor: "text-blue-500"
  },
  95: {
    label: "Thunderstorm",
    iconName: "CloudLightning",
    bgGradient: "from-slate-600 to-slate-800",
    bgGradientDark: "from-slate-700/40 to-slate-900/40",
    textColor: "text-slate-100",
    iconColor: "text-amber-400"
  },
  96: {
    label: "Thunderstorm with Slight Hail",
    iconName: "CloudLightning",
    bgGradient: "from-slate-700 to-slate-900",
    bgGradientDark: "from-slate-800/45 to-slate-950/45",
    textColor: "text-slate-100",
    iconColor: "text-amber-300"
  },
  99: {
    label: "Thunderstorm with Heavy Hail",
    iconName: "CloudLightning",
    bgGradient: "from-slate-800 to-zinc-950",
    bgGradientDark: "from-slate-900/50 to-zinc-950/50",
    textColor: "text-amber-100",
    iconColor: "text-amber-400"
  }
};

export const getWeatherDetails = (code: number): WeatherCodeDetails => {
  return weatherCodeMap[code] || {
    label: "Unknown Conditions",
    iconName: "HelpCircle",
    bgGradient: "from-slate-200 to-slate-300",
    bgGradientDark: "from-slate-500/10 to-slate-600/10",
    textColor: "text-slate-800",
    iconColor: "text-slate-400"
  };
};

export const getWeatherIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "Sun": return Sun;
    case "CloudSun": return CloudSun;
    case "Cloud": return Cloud;
    case "CloudFog": return CloudFog;
    case "CloudDrizzle": return CloudDrizzle;
    case "CloudRain": return CloudRain;
    case "CloudSnow": return CloudSnow;
    case "CloudLightning": return CloudLightning;
    case "Snowflake": return Snowflake;
    default: return HelpCircle;
  }
};
