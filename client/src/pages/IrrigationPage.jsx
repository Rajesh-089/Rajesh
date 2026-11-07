import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Droplets, Sparkles, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function IrrigationPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    growthStage: 'Crown Root Initiation (CRI Stage)',
    soilType: 'Loamy Soil',
    waterAvailability: 'moderate',
    irrigationMethod: 'Furrow / Border Strip',
    rainfallMm: 0,
    observedMoisture: 'Normal Damp'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setResult(null);
      const res = await api.generateIrrigationAdvice({ ...formData, language });
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Could not generate irrigation schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Water Resource Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Droplets className="w-7 h-7 text-blue-600" />
            <span>Smart Irrigation & Moisture Scheduling</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Calculates moisture depletion and watering intervals matched against crop phenology and rainfall forecasts.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Crop Growth Phase
                </label>
                <input
                  type="text"
                  name="growthStage"
                  value={formData.growthStage}
                  onChange={handleChange}
                  placeholder="e.g. Vegetative / Flowering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Water Availability
                </label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="high">High (Perennial Source / Canal)</option>
                  <option value="moderate">Moderate (Borewell / Open well)</option>
                  <option value="low">Low (Limited / Rainfed)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Irrigation System
                </label>
                <select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="Drip Irrigation">Drip Irrigation (Micro)</option>
                  <option value="Sprinkler System">Sprinkler Overhead</option>
                  <option value="Furrow / Border Strip">Furrow / Border Strip</option>
                  <option value="Flood / Basin">Flood / Basin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Soil Moisture Status
                </label>
                <select
                  name="observedMoisture"
                  value={formData.observedMoisture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="Normal Damp">Normal Damp (Optimal field capacity)</option>
                  <option value="Dry & Cracked">Dry & Cracked (Water deficit)</option>
                  <option value="Saturated / Waterlogged">Saturated / Soggy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recent Rainfall (mm)
                </label>
                <input
                  type="number"
                  name="rainfallMm"
                  value={formData.rainfallMm}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Evaluating moisture requirements..." />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Calculate Irrigation Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Irrigation Guidance Verdict
                </h3>
                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>
              <VoicePlayer text={result.summary} language={language} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Watering Timing & Critical Growth Stages
              </h3>
              <div className="space-y-3">
                {result.recommendations?.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{item.stage}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {item.guidance}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{item.reason}</p>
                    {item.waterConservationTips && item.waterConservationTips.length > 0 && (
                      <div className="pt-1 text-xs text-forest-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>Tip: {item.waterConservationTips.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
