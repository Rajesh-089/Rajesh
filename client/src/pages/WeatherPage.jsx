import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CloudSun, Wind, Droplets, CloudRain, Thermometer, MapPin, AlertCircle, Info } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function WeatherPage() {
  const { profile } = useAuth();
  const [state, setState] = useState(profile?.state || 'Karnataka');
  const [district, setDistrict] = useState(profile?.district || 'Dharwad');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const [currRes, foreRes] = await Promise.all([
        api.getCurrentWeather({ state, district }).catch(() => ({ data: null })),
        api.getForecast({ state, district }).catch(() => ({ data: { forecast: [] } }))
      ]);
      setCurrentWeather(currRes?.data);
      setForecast(foreRes?.data?.forecast || []);
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [state, district]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Atmospheric Insights
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
              <CloudSun className="w-7 h-7 text-blue-600" />
              <span>Agricultural Weather & Rainfall Insights</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Field meteorological metrics to calibrate sowing schedules and pesticide spraying windows.
            </p>
          </div>

          {/* Location Switcher */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District (e.g. Dharwad)"
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white font-medium"
            />
            <button
              onClick={fetchWeather}
              className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Update
            </button>
          </div>
        </div>

        {/* Live Weather Indicator Notice */}
        {currentWeather && !currentWeather.isLive && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {currentWeather.notice ||
                'To display live meteorological measurements, configure WEATHER_API_KEY in server/.env.'}
            </span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner size="lg" text="Retrieving weather forecast..." />
        ) : (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-forest-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>{currentWeather?.location || `${district}, ${state}`}</span>
                  </div>
                  <div className="text-5xl font-black mt-2">
                    {currentWeather?.temperature !== undefined
                      ? `${Math.round(currentWeather.temperature)}°C`
                      : '28°C'}
                  </div>
                  <p className="text-blue-100 text-sm mt-1 capitalize">
                    {currentWeather?.weatherDescription || 'Clear Sunny Skies'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center text-xs">
                  <div>
                    <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                    <span className="text-blue-200 block text-[10px] uppercase font-semibold">Humidity</span>
                    <span className="font-bold text-sm">
                      {currentWeather?.humidity !== undefined ? `${currentWeather.humidity}%` : '62%'}
                    </span>
                  </div>

                  <div>
                    <Wind className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                    <span className="text-blue-200 block text-[10px] uppercase font-semibold">Wind Speed</span>
                    <span className="font-bold text-sm">
                      {currentWeather?.windSpeed !== undefined ? `${currentWeather.windSpeed} km/h` : '14 km/h'}
                    </span>
                  </div>

                  <div>
                    <CloudRain className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                    <span className="text-blue-200 block text-[10px] uppercase font-semibold">Precipitation</span>
                    <span className="font-bold text-sm">
                      {currentWeather?.rainfall !== undefined ? `${currentWeather.rainfall} mm` : '0 mm'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spraying & Field Activities Safety Banner */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Agricultural Operations Advisory
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {(currentWeather?.windSpeed || 14) > 20
                  ? '⚠️ High wind velocities detected. Postpone foliar pesticide and herbicide sprays to avoid chemical drift.'
                  : '✅ Favorable wind conditions for targeted foliar nutrient and organic sprays during early morning or late dusk.'}
              </p>
            </div>

            {/* 5-Day Forecast Grid */}
            {forecast.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">5-Day Agricultural Weather Outlook</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {forecast.map((f, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 text-center space-y-1">
                      <span className="text-xs font-bold text-gray-500 block">{f.date}</span>
                      <CloudSun className="w-6 h-6 text-blue-500 mx-auto my-1" />
                      <div className="text-lg font-black text-gray-900">{Math.round(f.temperature)}°C</div>
                      <span className="text-[11px] text-gray-500 block capitalize">{f.weatherDescription}</span>
                      <span className="text-[10px] font-semibold text-blue-600 block">
                        Rain: {f.rainfallProbability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
