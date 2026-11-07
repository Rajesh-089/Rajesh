import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { ArrowLeft, Printer, Sprout, Calendar, Share2, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import CropRecommendationCard from '../components/crop/CropRecommendationCard.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function RecommendationDetailPage() {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecord() {
      try {
        setLoading(true);
        const res = await api.getAdvisoryById(id);
        setAdvisory(res.data);
      } catch (err) {
        setError(err.message || 'Unable to load advisory details.');
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between no-print">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Retrieving advisory report..." />
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-red-200 text-red-700 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <h3 className="text-base font-bold">Advisory Record Unavailable</h3>
            <p className="text-xs">{error}</p>
          </div>
        ) : !advisory ? (
          <p className="text-center text-sm text-gray-500">Record not found.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
                  {advisory.advisory_type?.toUpperCase()} ADVISORY DOSSIER
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Field Advisory Report
                </h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Generated on {new Date(advisory.created_at).toLocaleString()}</span>
                  <span>• Model: {advisory.model_name || 'Gemini 2.5'}</span>
                </p>
              </div>

              <div className="no-print">
                <VoicePlayer
                  text={advisory.ai_response?.summary || 'Agricultural advisory'}
                  language={advisory.language}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-forest-50/70 p-4 rounded-xl border border-forest-100">
              <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                Executive Agronomic Summary
              </h3>
              <p className="text-sm text-forest-950 font-medium leading-relaxed">
                {advisory.ai_response?.summary}
              </p>
            </div>

            {/* If Crop Advisory */}
            {advisory.advisory_type === 'crop' && advisory.ai_response?.recommendations && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Recommended Crops</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advisory.ai_response.recommendations.map((crop, idx) => (
                    <CropRecommendationCard key={idx} crop={crop} rank={idx + 1} />
                  ))}
                </div>
              </div>
            )}

            {/* Input Snapshot */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Field Input Parameters Snapshot
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl text-xs">
                {advisory.input_data &&
                  Object.entries(advisory.input_data).map(([k, v]) => {
                    if (typeof v === 'object' && v !== null) return null;
                    return (
                      <div key={k}>
                        <span className="text-gray-400 block font-medium capitalize">
                          {k.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-bold text-gray-800">{String(v || 'N/A')}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-gray-400 text-center italic pt-4">
              {advisory.ai_response?.disclaimer ||
                'This report is generated using agricultural artificial intelligence. Consult your local extension office for high-stakes decisions.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
