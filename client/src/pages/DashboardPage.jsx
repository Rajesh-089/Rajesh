import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import {
  Sprout,
  MapPin,
  CloudSun,
  History,
  FlaskConical,
  Droplets,
  Bug,
  BotMessageSquare,
  ArrowRight,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [lands, setLands] = useState([]);
  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load lands
        const landsRes = await api.getLands().catch(() => ({ data: [] }));
        setLands(landsRes.data || []);

        // Load recent advisories
        const advRes = await api.getAdvisoryHistory({ limit: 4 }).catch(() => ({ data: [] }));
        setRecentAdvisories(advRes.data || []);

        // Load weather for user's district or default
        const district = profile?.district || 'Dharwad';
        const state = profile?.state || 'Karnataka';
        const weatherRes = await api.getCurrentWeather({ district, state }).catch(() => ({ data: null }));
        setWeather(weatherRes.data);
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [profile]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-leaf rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Kisan Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {profile?.full_name || user?.user_metadata?.full_name || 'Farmer'}!
            </h1>
            <p className="text-forest-100 text-sm max-w-xl">
              {profile?.district ? `${profile.district}, ${profile.state}` : 'Indian Agricultural Region'} • Ready for precision crop planning and advisory management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/crop-advisory"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-forest-800 hover:bg-forest-50 font-bold text-sm shadow-sm transition-all"
            >
              <Sprout className="w-4 h-4 text-forest-600" />
              <span>New Crop Advisory</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lands Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Registered Land</span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {lands.length} <span className="text-xs font-semibold text-gray-500">parcels</span>
              </p>
              <Link to="/land-details" className="text-xs font-semibold text-forest-700 hover:text-forest-800 mt-1 inline-flex items-center gap-1">
                Manage Lands <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          {/* Weather Snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Local Weather</span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {weather?.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '28°C'}
              </p>
              <span className="text-xs text-gray-500 block truncate max-w-[130px]">
                {weather?.weatherDescription || 'Fair & Sunny'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudSun className="w-6 h-6" />
            </div>
          </div>

          {/* Past Advisories */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Generated Reports</span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {recentAdvisories.length} <span className="text-xs font-semibold text-gray-500">advisories</span>
              </p>
              <Link to="/history" className="text-xs font-semibold text-forest-700 hover:text-forest-800 mt-1 inline-flex items-center gap-1">
                View History <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">AI Model</span>
              <p className="text-sm font-bold text-gray-900 mt-1">Gemini 2.5</p>
              <span className="text-[11px] font-semibold text-emerald-600 inline-block bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                Active & Ready
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Launchpad to Advisory Engines */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Agricultural Decision Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/crop-advisory"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-forest-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-forest-700">Crop Suitability AI</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Ranked crop recommendations based on soil NPK, pH & season.
              </p>
            </Link>

            <Link
              to="/fertilizer-advisory"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-amber-700">Fertilizer & NPK</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Stage-wise nutrient dosage and soil improvement recommendations.
              </p>
            </Link>

            <Link
              to="/irrigation-advisory"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-700">Irrigation Planner</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Watering cycles adjusted for rainfall forecasts and growth stages.
              </p>
            </Link>

            <Link
              to="/pest-disease"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-red-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-700">Pest & Plant Health</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Symptom diagnosis with safe Integrated Pest Management (IPM).
              </p>
            </Link>
          </div>
        </div>

        {/* Registered Farm Plots & Recent Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Farm Plots List */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-600" />
                <span>My Farm Land Parcels</span>
              </h2>
              <Link
                to="/land-details"
                className="text-xs font-bold text-forest-700 hover:text-forest-800 inline-flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Land</span>
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner size="sm" text="Loading farm parcels..." />
            ) : lands.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                <Sprout className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">No Land Parcels Registered</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Add your farm plot with soil pH and NPK measurements to receive tailored recommendations.
                </p>
                <Link
                  to="/land-details"
                  className="inline-block mt-2 text-xs font-bold text-forest-700 hover:text-forest-800"
                >
                  + Add First Farm Parcel
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lands.slice(0, 3).map((land) => (
                  <div key={land.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{land.land_name}</h4>
                      <p className="text-xs text-gray-500">
                        {land.area} {land.area_unit} • {land.soil_type || 'Unknown soil'} • {land.district}, {land.state}
                      </p>
                    </div>
                    <Link
                      to="/crop-advisory"
                      state={{ selectedLandId: land.id }}
                      className="text-xs font-bold text-forest-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-forest-50"
                    >
                      Plan Crops
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Advisories */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <span>Recent AI Advisories</span>
              </h2>
              <Link to="/history" className="text-xs font-bold text-forest-700 hover:text-forest-800">
                View All
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner size="sm" text="Loading advisories..." />
            ) : recentAdvisories.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">No Advisory Reports Yet</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Run your first AI crop suitability analysis to unlock precision recommendations.
                </p>
                <Link
                  to="/crop-advisory"
                  className="inline-block mt-2 text-xs font-bold text-forest-700 hover:text-forest-800"
                >
                  Generate Crop Plan
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAdvisories.map((item) => (
                  <Link
                    key={item.id}
                    to={`/recommendations/${item.id}`}
                    className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:bg-forest-50/50 transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                          {item.advisory_type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {item.ai_response?.summary || 'Agricultural analysis completed'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
