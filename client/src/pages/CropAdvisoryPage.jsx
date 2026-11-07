import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Sprout, Sparkles, AlertCircle, Info, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import CropRecommendationCard from '../components/crop/CropRecommendationCard.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function CropAdvisoryPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState(location.state?.selectedLandId || '');
  
  const [formData, setFormData] = useState({
    state: profile?.state || 'Karnataka',
    district: profile?.district || 'Dharwad',
    season: 'Kharif',
    waterAvailability: 'moderate',
    soilType: 'Black Soil',
    soilPh: 7.2,
    nitrogen: 180,
    phosphorus: 35,
    potassium: 220,
    landArea: 2.5,
    areaUnit: 'acre',
    previousCrop: '',
    preferredCategory: '',
    budgetCategory: 'medium',
    language: language || 'en'
  });

  const [generating, setGenerating] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch registered lands
  useEffect(() => {
    async function fetchLands() {
      try {
        const res = await api.getLands();
        setLands(res.data || []);
      } catch (err) {
        console.warn('Could not fetch lands:', err);
      }
    }
    fetchLands();
  }, []);

  // When a land parcel is picked from dropdown, populate fields
  const handleLandSelection = (landId) => {
    setSelectedLandId(landId);
    if (!landId) return;

    const land = lands.find(l => l.id === landId);
    if (land) {
      setFormData(prev => ({
        ...prev,
        landId: land.id,
        state: land.state || prev.state,
        district: land.district || prev.district,
        soilType: land.soil_type || prev.soilType,
        soilPh: land.soil_ph !== null ? Number(land.soil_ph) : prev.soilPh,
        nitrogen: land.nitrogen !== null ? Number(land.nitrogen) : prev.nitrogen,
        phosphorus: land.phosphorus !== null ? Number(land.phosphorus) : prev.phosphorus,
        potassium: land.potassium !== null ? Number(land.potassium) : prev.potassium,
        landArea: Number(land.area) || prev.landArea,
        areaUnit: land.area_unit || prev.areaUnit,
        waterAvailability: land.irrigation_available ? 'moderate' : 'low',
        previousCrop: land.previous_crop || ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      setErrorMsg('');
      setAdvisoryResult(null);

      const payload = {
        ...formData,
        language
      };

      const res = await api.generateCropPlan(payload);
      setAdvisoryResult(res.data);
    } catch (err) {
      setErrorMsg(err.message || 'AI crop recommendation generation failed. Please check inputs and API credentials.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Primary Decision Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Sprout className="w-7 h-7 text-forest-600" />
            <span>AI Crop Suitability & Rotation Planner</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Ingests soil chemistry, agro-climatic season, and water access to rank the most profitable and biologically suitable crops.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Farm Parcel Selector */}
            {lands.length > 0 && (
              <div className="bg-forest-50/60 p-4 rounded-xl border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                  Auto-fill from My Farm Plots:
                </span>
                <select
                  value={selectedLandId}
                  onChange={(e) => handleLandSelection(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-forest-200 text-xs font-semibold text-gray-800 bg-white outline-none"
                >
                  <option value="">-- Choose a registered plot --</option>
                  {lands.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.land_name} ({l.area} {l.area_unit} • {l.soil_type || 'Unknown'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Geographic & Season Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  placeholder="Dharwad"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Season *
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none font-semibold text-forest-800"
                >
                  <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
                  <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
                  <option value="Zaid">Zaid (Summer: Mar - Jun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Water Access *
                </label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="high">High (Assured Canal / River / Drip)</option>
                  <option value="moderate">Moderate (Borewell / Tube well)</option>
                  <option value="low">Low (Rainfed / Dryland)</option>
                </select>
              </div>
            </div>

            {/* Soil Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Soil Texture
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white outline-none"
                >
                  <option value="Black Soil">Black Cotton Soil</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Loamy Soil">Loamy Soil</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  pH Reaction
                </label>
                <input
                  type="number"
                  name="soilPh"
                  value={formData.soilPh ?? ''}
                  onChange={handleInputChange}
                  step="0.1"
                  min="3.5"
                  max="10.5"
                  placeholder="7.2"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nitrogen (kg/ha)
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen ?? ''}
                  onChange={handleInputChange}
                  placeholder="180"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phosphorus (kg/ha)
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus ?? ''}
                  onChange={handleInputChange}
                  placeholder="35"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Potassium (kg/ha)
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium ?? ''}
                  onChange={handleInputChange}
                  placeholder="220"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>
            </div>

            {/* Constraints Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Previous Crop Harvested
                </label>
                <input
                  type="text"
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleInputChange}
                  placeholder="e.g. Groundnut, Fallow, Soybean"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Preferred Category (Optional)
                </label>
                <select
                  name="preferredCategory"
                  value={formData.preferredCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="">Any Category (Open)</option>
                  <option value="Cereals">Cereals & Grains</option>
                  <option value="Pulses">Pulses & Legumes</option>
                  <option value="Oilseeds">Oilseeds</option>
                  <option value="Commercial">Commercial Cash Crops</option>
                  <option value="Horticulture">Horticulture Vegetables</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Farmer Capital Budget
                </label>
                <select
                  name="budgetCategory"
                  value={formData.budgetCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white outline-none"
                >
                  <option value="low">Low (Subsistence / Organic)</option>
                  <option value="medium">Medium (Standard inputs)</option>
                  <option value="high">High (Commercial High-Input)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={generating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {generating ? (
                  <LoadingSpinner size="sm" text="Gemini Agronomist is analyzing your field..." />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Crop Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Presentation */}
        {advisoryResult && (
          <div className="space-y-6 pt-4">
            {/* Summary Banner with Audio Read-Aloud */}
            <div className="bg-gradient-to-r from-forest-50 via-white to-emerald-50 rounded-2xl border border-forest-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-600 text-white text-xs font-bold uppercase">
                    AI Agronomic Verdict
                  </span>
                  <span className="text-xs text-gray-400">
                    Confidence: High
                  </span>
                </div>
                <p className="text-base text-forest-950 font-medium leading-relaxed">
                  {advisoryResult.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <VoicePlayer
                  text={`${advisoryResult.summary}. Top recommendation is ${advisoryResult.recommendations?.[0]?.cropName}.`}
                  language={language}
                />
              </div>
            </div>

            {/* Ranked Crop Cards Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-forest-600" />
                <span>Ranked Crop Recommendations</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryResult.recommendations?.map((crop, idx) => (
                  <CropRecommendationCard
                    key={crop.cropName || idx}
                    crop={crop}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>

            {/* Observations & Next Steps Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Soil Observations */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Soil Health Diagnostic Notes</span>
                </h3>
                <ul className="space-y-2">
                  {advisoryResult.soilObservations?.map((obs, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 mt-1.5 shrink-0" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Next Steps */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Field Next Steps</span>
                </h3>
                <ul className="space-y-2">
                  {advisoryResult.nextSteps?.map((step, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            {advisoryResult.disclaimer && (
              <p className="text-[11px] text-gray-400 text-center italic">
                {advisoryResult.disclaimer}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
