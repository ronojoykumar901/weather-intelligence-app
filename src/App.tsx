import { useState, useEffect } from 'react';
import { 
  CloudSun, 
  RefreshCw, 
  WifiOff, 
  MapPin, 
  Moon, 
  Sun, 
  Sparkles,
  Info
} from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastGrid } from './components/ForecastGrid';
import { WeatherTrends } from './components/WeatherTrends';
import { PlanningAssistant } from './components/PlanningAssistant';
import { WeatherData, SearchHistoryItem } from './types';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState({
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fahrenheit preference state
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('isFahrenheit');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('isFahrenheit', JSON.stringify(isFahrenheit));
  }, [isFahrenheit]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Fetch weather data when selected location changes
  const fetchWeather = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Weather API returned error status');
      }

      const data = await response.json();
      
      if (!data.current_weather || !data.daily) {
        throw new Error('Invalid weather dataset structure');
      }

      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Could not fetch the weather forecast. Open-Meteo API might be down or you are offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(currentLocation.latitude, currentLocation.longitude);
  }, [currentLocation.latitude, currentLocation.longitude]);

  // Handle location selection
  const handleSelectLocation = (loc: { name: string; country: string; admin1?: string; latitude: number; longitude: number }) => {
    setCurrentLocation(loc);

    // Save to search history
    const newItem: SearchHistoryItem = {
      id: `${loc.latitude}-${loc.longitude}-${Date.now()}`,
      name: loc.name,
      country: loc.country,
      admin1: loc.admin1,
      latitude: loc.latitude,
      longitude: loc.longitude
    };

    setRecentSearches((prev) => {
      // Avoid duplicate coordinates in the list
      const filtered = prev.filter(
        (item) => 
          item.latitude.toFixed(3) !== loc.latitude.toFixed(3) || 
          item.longitude.toFixed(3) !== loc.longitude.toFixed(3)
      );
      // Put on front and keep max 5 items
      return [newItem, ...filtered].slice(0, 5);
    });
  };

  // Clear specific item
  const handleClearRecent = (id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all recents
  const handleClearAllRecents = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] flex flex-col selection:bg-blue-500/30" id="main-container">
      {/* Top Header Section */}
      <header className="bg-[#0F1115] border-b border-[#2D333E] py-5 px-4 sm:px-8 relative z-10" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Brand Grid */}
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/25">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                  Weather Intelligence
                </span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 py-0.5 px-2 rounded-full tracking-wider uppercase">
                  V1.2
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-medium font-sans mt-0.5">
                Dynamic geocoding forecasts with tailored logic planning metrics
              </p>
            </div>
          </div>

          {/* Search bar integration directly into header for clean spacing */}
          <div className="flex-1 max-w-lg md:mx-6 w-full">
            <SearchBar 
              onSelectLocation={handleSelectLocation}
              recentSearches={recentSearches}
              onClearRecent={handleClearRecent}
              onClearAllRecents={handleClearAllRecents}
            />
          </div>

          {/* Unit Toggle controls & Refresh */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              type="button"
              id="refresh-button"
              onClick={() => fetchWeather(currentLocation.latitude, currentLocation.longitude)}
              disabled={isLoading}
              className="p-3 text-[#94A3B8] hover:text-white bg-[#1A1D24] hover:bg-[#252A34] rounded-2xl border border-[#2D333E] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              title="Refresh Forecast"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Premium Unit Selector */}
            <div className="bg-[#13161C] p-1 rounded-2xl border border-[#2D333E] flex">
              <button
                type="button"
                id="toggle-unit-c"
                onClick={() => setIsFahrenheit(false)}
                className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                  !isFahrenheit 
                    ? 'bg-[#1A1D24] border border-[#2D333E]/50 text-white shadow-md' 
                    : 'text-[#4B5563] hover:text-[#94A3B8]'
                }`}
              >
                °C (Metric)
              </button>
              <button
                type="button"
                id="toggle-unit-f"
                onClick={() => setIsFahrenheit(true)}
                className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                  isFahrenheit 
                    ? 'bg-[#1A1D24] border border-[#2D333E]/50 text-white shadow-md' 
                    : 'text-[#4B5563] hover:text-[#94A3B8]'
                }`}
              >
                °F (Imperial)
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body Content Space */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6" id="app-main">
        
        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-950/20 border border-red-900/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-sm" id="error-alert">
            <div className="p-4 bg-red-950/40 rounded-2xl text-red-400 border border-red-900/30 animate-pulse">
              <WifiOff className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-white font-display">
                Forecast Retrieval Error
              </h3>
              <p className="text-xs sm:text-sm text-red-400 font-sans font-medium">
                {error}
              </p>
            </div>
            <button
              type="button"
              id="retry-button"
              onClick={() => fetchWeather(currentLocation.latitude, currentLocation.longitude)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-600/15 whitespace-nowrap cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading Skeleton Panel */}
        {isLoading && (
          <div className="space-y-6" id="skeleton-container">
            {/* Upper Current & AI Box Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl p-6 sm:p-8 space-y-6 animate-pulse">
                <div className="h-4 bg-[#13161C] rounded-md w-1/4"></div>
                <div className="h-10 bg-[#13161C] rounded-md w-1/2"></div>
                <div className="h-6 bg-[#13161C] rounded-md w-1/3"></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="h-20 bg-[#13161C] rounded-2xl"></div>
                  <div className="h-20 bg-[#13161C] rounded-2xl"></div>
                  <div className="h-20 bg-[#13161C] rounded-2xl"></div>
                  <div className="h-20 bg-[#13161C] rounded-2xl"></div>
                </div>
              </div>
              <div className="bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-[#13161C] rounded-md w-2/3"></div>
                <div className="h-24 bg-[#13161C] rounded-2xl"></div>
                <div className="h-24 bg-[#13161C] rounded-2xl"></div>
              </div>
            </div>

            {/* Forecast Grid Skeleton */}
            <div className="bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl p-6 animate-pulse space-y-4">
              <div className="h-6 bg-[#13161C] rounded-md w-1/4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="h-32 bg-[#13161C] rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Weather Dashboards (Render when data loaded and NOT loading) */}
        {!isLoading && weatherData && (
          <div className="space-y-6 animate-fade-in" id="dashboard-content">
            
            {/* Top Dashboard Layout (Current weather & Recommendations side-by-side) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Segment: Current weather status */}
              <div className="lg:col-span-2 space-y-6">
                <CurrentWeather 
                  location={currentLocation}
                  weatherData={weatherData}
                  isFahrenheit={isFahrenheit}
                />
                
                {/* Visual Trends Segment inside left column */}
                <WeatherTrends 
                  dailyData={weatherData.daily}
                  isFahrenheit={isFahrenheit}
                />
              </div>

              {/* Right Segment: Smart planning assistant rules logic */}
              <div className="lg:col-span-1">
                <PlanningAssistant 
                  currentWeather={weatherData.current_weather}
                  dailyData={weatherData.daily}
                  locationName={currentLocation.name}
                />
              </div>

            </div>

            {/* 7-Day Forecast Row */}
            <ForecastGrid 
              dailyData={weatherData.daily}
              isFahrenheit={isFahrenheit}
            />

          </div>
        )}

        {/* Informative Footer Note */}
        <footer className="pt-6 border-t border-[#2D333E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563] font-sans">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#4B5563]" />
            <span>Open meteorological forecast models provided exclusively by Open-Meteo.</span>
          </div>
          <div>
            <span>Developed for ronojoy.kumar@tigeranalytics.com • AI Studio Build</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
