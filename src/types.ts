export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State / Province
  admin2?: string;
  country: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface DailyUnits {
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  windspeed_10m_max: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  daily_units: DailyUnits;
}

export interface WeatherCodeDetails {
  label: string;
  iconName: string; // Used to select the Lucide icon
  bgGradient: string; // Tailwind gradient classes for light theme
  bgGradientDark: string; // Tailwind gradient classes for dark card details
  textColor: string;
  iconColor: string;
}

export interface SearchHistoryItem {
  id: string;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
