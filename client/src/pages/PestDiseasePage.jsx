import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Bug, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ToxicityBadge from '../components/common/ToxicityBadge.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function PestDiseasePage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    growthStage: 'Fruiting / Berry Development',
    symptoms: 'Yellowing of lower leaf margins with concentric brown target rings, premature leaf drop and small dark spots on green fruit.',
    affectedParts: ['Leaves', 'Fruit'],
    durationDays: 5,
    location: 'Karnataka'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const plantPartsList = ['Leaves', 'Stems', 'Flowers', 'Fruit / Pods', 'Roots', 'Whole Plant'];

  const handlePartToggle = (part) => {
    setFormData(prev => ({
      ...prev,
      affectedParts: prev.affectedParts.includes(part)
        ? prev.affectedParts.filter(p => p !== part)
        : [...prev.affectedParts, part]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.affectedParts.length === 0) {
      setError('Please select at least one affected plant part.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      const res = await api.generatePestAdvice({ ...formData, language });
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Could not analyze plant symptoms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Plant Pathology & IPM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Bug className="w-7 h-7 text-red-600" />
            <span>Pest & Crop Disease Diagnostic Assistant</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Analyze visible crop distress symptoms to identify probable pathogens with Integrated Pest Management (IPM) biological remedies.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Affected Crop *
                </label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cotton, Chilli, Tomato"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Growth Stage
                </label>
                <input
                  type="text"
                  name="growthStage"
                  value={formData.growthStage}
                  onChange={handleChange}
                  placeholder="e.g. Flowering / Vegetative"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Duration (Days Observed)
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>
            </div>

            {/* Affected Plant Parts Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Affected Plant Organs *
              </label>
              <div className="flex flex-wrap gap-2">
                {plantPartsList.map((part) => {
                  const selected = formData.affectedParts.includes(part);
                  return (
                    <button
                      type="button"
                      key={part}
                      onClick={() => handlePartToggle(part)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                        selected
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {part}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symptoms Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Detailed Symptom Description *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Describe leaf discoloration, wilting, insect damage, fungal spots or lesions in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Diagnosing symptoms with Gemini..." />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-red-200" />
                    <span>Diagnose Crop Symptoms</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="bg-red-50/80 p-6 rounded-2xl border border-red-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                  Diagnostic Overview
                </h3>
                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>
              <VoicePlayer text={result.summary} language={language} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.possibleIssues?.map((issue, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{issue.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-block mt-1">
                        Confidence: {issue.confidence}
                      </span>
                    </div>
                    <ToxicityBadge level={issue.confidence === 'high' ? 'moderate' : 'organic'} />
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{issue.explanation}</p>

                  {issue.preventiveMeasures && issue.preventiveMeasures.length > 0 && (
                    <div className="bg-forest-50/70 p-3.5 rounded-xl border border-forest-100 space-y-1.5">
                      <h4 className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-forest-600" />
                        <span>Biological / Cultural IPM Practices</span>
                      </h4>
                      <ul className="space-y-1">
                        {issue.preventiveMeasures.map((m, i) => (
                          <li key={i} className="text-xs text-forest-800 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-forest-600">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-1 text-xs text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Recommended Action: {issue.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 text-center italic">
              {result.disclaimer ||
                'Text-based symptom analysis is an advisory estimate. For confirmed identification, consult your nearest Krishi Vigyan Kendra (KVK).'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
