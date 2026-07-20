import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Thermometer, Droplets, Info } from 'lucide-react';
import { DailyForecast } from '../types';

interface WeatherTrendsProps {
  dailyData: DailyForecast;
  isFahrenheit: boolean;
}

export const WeatherTrends: React.FC<WeatherTrendsProps> = ({
  dailyData,
  isFahrenheit,
}) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'precip'>('temp');

  const {
    time,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_sum,
  } = dailyData;

  // Convert temperature helper
  const convertTemp = (celsius: number) => {
    if (isFahrenheit) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const getDayLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { weekday: 'short', month: 'numeric' + '/' + 'day' === 'numeric/day' ? 'numeric' : 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Formulate data source for Recharts
  const chartData = time.map((t, idx) => ({
    name: getDayLabel(t),
    maxTemp: convertTemp(temperature_2m_max[idx]),
    minTemp: convertTemp(temperature_2m_min[idx]),
    precipitation: parseFloat(precipitation_sum[idx].toFixed(1)),
  }));

  const tempUnit = isFahrenheit ? '°F' : '°C';

  // Custom Tooltip component for a beautifully styled lookup experience
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg border border-slate-800 text-xs font-sans">
          <p className="font-bold text-slate-300 mb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any) => (
              <p key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-400 capitalize">{entry.name}:</span>
                <span className="font-bold font-mono">
                  {entry.value} {entry.name.includes('precipitation') ? 'mm' : tempUnit}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="weather-trends-card" className="w-full bg-[#1A1D24] rounded-3xl border border-[#2D333E] shadow-2xl p-6 sm:p-8">
      {/* Chart Headers & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D333E] pb-5 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Weather Intelligence Trends</span>
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium font-sans mt-0.5">
            Visualize forecasted trends over the upcoming 7 days
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#13161C] p-1 rounded-xl self-start sm:self-auto border border-[#2D333E]/50">
          <button
            type="button"
            id="trends-tab-temp"
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-[#1A1D24] border border-[#2D333E] text-blue-400 shadow-md'
                : 'text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Temperature</span>
          </button>
          <button
            type="button"
            id="trends-tab-precip"
            onClick={() => setActiveTab('precip')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'precip'
                ? 'bg-[#1A1D24] border border-[#2D333E] text-blue-400 shadow-md'
                : 'text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[280px] sm:h-[320px] w-full" id="trends-chart-container">
        {activeTab === 'temp' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D333E" />
              <XAxis 
                dataKey="name" 
                stroke="#4B5563" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#4B5563" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                unit={tempUnit}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
              />
              <Line
                type="monotone"
                dataKey="maxTemp"
                name="Max Temp"
                stroke="#ef4444"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                name="Min Temp"
                stroke="#0284c7"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D333E" />
              <XAxis 
                dataKey="name" 
                stroke="#4B5563" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#4B5563" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                unit="mm"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="square"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
              />
              <Bar 
                dataKey="precipitation" 
                name="Precipitation" 
                fill="#3b82f6" 
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quick Trend Summary Note */}
      <div className="mt-4 flex items-start gap-2 bg-blue-950/20 rounded-xl p-3 text-xs text-blue-400 font-sans border border-blue-900/30">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {activeTab === 'temp' ? (
            <span>
              The peak max temperature forecast reaches its summit at{' '}
              <strong className="font-mono text-[#E2E8F0]">
                {Math.max(...temperature_2m_max).toFixed(0)}°C ({convertTemp(Math.max(...temperature_2m_max))}{tempUnit})
              </strong>, with a minimum low bottoming out at{' '}
              <strong className="font-mono text-[#E2E8F0]">
                {Math.min(...temperature_2m_min).toFixed(0)}°C ({convertTemp(Math.min(...temperature_2m_min))}{tempUnit})
              </strong>.
            </span>
          ) : (
            <span>
              The total maximum precipitation over a single day is projected to be{' '}
              <strong className="font-mono text-[#E2E8F0]">{Math.max(...precipitation_sum).toFixed(1)} mm</strong>. A value of 0 mm indicates excellent dry spells ideal for outdoor schedules.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
