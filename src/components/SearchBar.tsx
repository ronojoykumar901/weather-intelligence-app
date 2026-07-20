import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, History, CloudSun } from 'lucide-react';
import { GeocodingResult, SearchHistoryItem } from '../types';

interface SearchBarProps {
  onSelectLocation: (location: { name: string; country: string; admin1?: string; latitude: number; longitude: number }) => void;
  recentSearches: SearchHistoryItem[];
  onClearRecent: (id: string) => void;
  onClearAllRecents: () => void;
}

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257 },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7143, longitude: -74.006 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8678, longitude: 151.2073 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  recentSearches,
  onClearRecent,
  onClearAllRecents
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search trigger as the user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const encodedQuery = encodeURIComponent(query.trim());
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=5&language=en&format=json`
        );
        
        if (!res.ok) {
          throw new Error('Geocoding service unavailable');
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setShowDropdown(true);
        } else {
          setResults([]);
          setError('No locations found matching your search.');
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search API error:', err);
        setError('Network error, please try again.');
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a city or country name.');
      setShowDropdown(true);
      return;
    }
  };

  const handleSelect = (loc: { name: string; country: string; admin1?: string; latitude: number; longitude: number }) => {
    onSelectLocation(loc);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="search-bar-container" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative z-20">
        <div className="relative">
          <input
            id="search-input"
            type="text"
            className="w-full pl-12 pr-10 py-3.5 bg-[#1A1D24] rounded-2xl shadow-inner border border-[#2D333E] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-[#E2E8F0] placeholder-[#4B5563] font-sans text-sm sm:text-base transition-all"
            placeholder="Search city, e.g. San Francisco, Tokyo..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          {query && (
            <button
              type="button"
              id="clear-search"
              onClick={() => {
                setQuery('');
                setResults([]);
                setError(null);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#E2E8F0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown for search results and history */}
      {showDropdown && (
        <div 
          id="search-dropdown"
          className="absolute left-0 right-0 mt-2 bg-[#1A1D24] rounded-2xl border border-[#2D333E] shadow-2xl overflow-hidden z-30 max-h-[450px] overflow-y-auto w-full max-w-2xl mx-auto"
        >
          {/* Geocoding Results */}
          {results.length > 0 && (
            <div className="p-2 border-b border-[#2D333E]">
              <div className="px-3 py-1.5 text-xs font-semibold text-[#4B5563] tracking-wider uppercase font-sans">
                Search Results
              </div>
              <ul className="space-y-0.5">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      id={`result-${item.id}`}
                      onClick={() => handleSelect({
                        name: item.name,
                        country: item.country,
                        admin1: item.admin1,
                        latitude: item.latitude,
                        longitude: item.longitude
                      })}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#252A34] flex items-center gap-3 transition-colors group"
                    >
                      <MapPin className="w-4 h-4 text-[#4B5563] group-hover:text-blue-500 transition-colors shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#E2E8F0] font-sans">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#94A3B8] font-sans">
                          {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                        </span>
                      </div>
                      <span className="ml-auto text-[10px] font-mono text-[#4B5563] group-hover:text-[#94A3B8]">
                        {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validation or Error Message */}
          {error && (
            <div className="p-4 text-center text-sm text-amber-400 font-sans flex flex-col items-center justify-center gap-1.5 bg-amber-950/25 border-b border-[#2D333E]">
              <span className="font-semibold">{error}</span>
              <span className="text-xs text-[#94A3B8]">Try another search term or click one of the popular cities below.</span>
            </div>
          )}

          {/* Search History */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-b border-[#2D333E]">
              <div className="px-3 py-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4B5563] tracking-wider uppercase font-sans flex items-center gap-1">
                  <History className="w-3 h-3" /> Recent Searches
                </span>
                <button
                  type="button"
                  id="clear-all-recents"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAllRecents();
                  }}
                  className="text-xs text-red-400 hover:text-red-500 hover:underline transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-0.5">
                {recentSearches.map((item) => (
                  <li key={item.id} className="group relative flex items-center">
                    <button
                      type="button"
                      id={`recent-${item.id}`}
                      onClick={() => handleSelect({
                        name: item.name,
                        country: item.country,
                        admin1: item.admin1,
                        latitude: item.latitude,
                        longitude: item.longitude
                      })}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252A34] flex items-center gap-3 transition-colors"
                    >
                      <History className="w-4 h-4 text-[#4B5563] group-hover:text-blue-500 transition-colors shrink-0" />
                      <div className="flex flex-col pr-8">
                        <span className="text-sm font-medium text-[#94A3B8] group-hover:text-[#E2E8F0] font-sans">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#4B5563]">
                          {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      id={`clear-recent-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearRecent(item.id);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#4B5563] hover:text-[#E2E8F0] rounded-lg hover:bg-[#252A34] transition-colors group-hover:opacity-100 opacity-0 cursor-pointer"
                      title="Remove from history"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Select Popular Cities */}
          <div className="p-3 bg-[#13161C]">
            <div className="px-3 py-1.5 text-xs font-semibold text-[#4B5563] tracking-wider uppercase font-sans flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5" /> Popular Destinations
            </div>
            <div className="mt-2 flex flex-wrap gap-2 px-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  type="button"
                  key={city.name}
                  id={`popular-${city.name}`}
                  onClick={() => handleSelect(city)}
                  className="px-3 py-1.5 text-xs font-medium text-[#94A3B8] bg-[#1A1D24] rounded-full border border-[#2D333E] hover:border-blue-500 hover:text-blue-400 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#4B5563]" />
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
