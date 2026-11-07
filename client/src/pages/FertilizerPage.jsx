import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { FlaskConical, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function FertilizerPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    growthStage: 'Vegetative Growth (30 DAS)',
    soilType: 'Red Soil',
    soilPh: 6.8,
    nitrogen: 160,
    phosphorus: 25,
    potassium: 210,
    farmingMethod: 'integrated'
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
      const res = await api.generateFertilizerAdvice({ ...formData, language });
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Could not generate fertilizer advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Nutrient & Soil Care
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
            <FlaskConical className="w-7 h-7 text-amber-600" />
            <span>Fertilizer & Balanced Nutrient Advisory</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Calculates balanced nutrient schedules and organic amendments to restore soil fertility and prevent chemical leaching.
          </p>
        </div>

        {/* Input Form */}
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
                  Target Crop *
                </label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  placeholder="e.g. Cotton / Maize / Wheat"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Crop Growth Stage *
                </label>
                <select
                  name="growthStage"
                  value={formData.growthStage}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="Basal / Land Preparation">Basal / Land Preparation</option>
                  <option value="Sowing / Germination">Sowing / Germination</option>
                  <option value="Vegetative Growth (30 DAS)">Vegetative Growth</option>
                  <option value="Flowering & Bud Initiation">Flowering & Bud Initiation</option>
                  <option value="Fruit / Grain Filling">Fruit / Grain Filling</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Farming Approach
                </label>
                <select
                  name="farmingMethod"
                  value={formData.farmingMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="integrated">Integrated (Bio + Judicious Synthetic)</option>
                  <option value="organic">100% Organic (FYM, Vermicompost, Biofertilizers)</option>
                  <option value="conventional">Conventional High-Yield</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Soil pH
                </label>
                <input
                  type="number"
                  name="soilPh"
                  value={formData.soilPh ?? ''}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  N (kg/ha)
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  P (kg/ha)
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  K (kg/ha)
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Formulating nutrient schedule..." />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Calculate Fertilizer Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Nutrient Plan Assessment
                </h3>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>
              <VoicePlayer text={result.summary} language={language} />
            </div>

            {/* Recommendations Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Application Schedule & Formulations
              </h3>
              <div className="space-y-3">
                {result.recommendations?.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{item.suggestion}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {item.timing}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{item.reason}</p>
                    {item.precautions && item.precautions.length > 0 && (
                      <div className="text-[11px] text-amber-800 flex items-center gap-1.5 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>Precaution: {item.precautions.join(', ')}</span>
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
