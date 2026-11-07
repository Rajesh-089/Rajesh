import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Settings, Globe, Shield, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { isConfigured } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        setCheckingHealth(true);
        const res = await api.checkHealth();
        setHealthStatus(res.data);
      } catch (e) {
        setHealthStatus({ status: 'offline', error: e.message });
      } finally {
        setCheckingHealth(false);
      }
    }
    checkBackend();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-forest-600" />
            <span>Application Settings & System Status</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your interface language and inspect backend service connectivity.
          </p>
        </div>

        {/* Language Preference Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-forest-600" />
            <span>Preferred Language</span>
          </h3>
          <p className="text-xs text-gray-500">
            Select the primary language for AI-generated agricultural explanations, audio synthesis, and navigation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'en', label: 'English', desc: 'Standard Agricultural English' },
              { id: 'kn', label: 'ಕನ್ನಡ (Kannada)', desc: 'ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ಸೂಕ್ತ' },
              { id: 'hi', label: 'हिन्दी (Hindi)', desc: 'हिंदी भाषा में कृषि परामर्श' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === item.id
                    ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">{item.label}</span>
                  {language === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Backend & Integration Connectivity */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>System Health & Services Status</span>
          </h3>

          {checkingHealth ? (
            <LoadingSpinner size="sm" text="Checking backend health..." />
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-800">Express API Gateway</h4>
                  <p className="text-[11px] text-gray-500">
                    Status:{' '}
                    <span className="font-semibold text-emerald-600">
                      {healthStatus?.status === 'healthy' ? 'Operational (Online)' : 'Offline / Checking'}
                    </span>
                  </p>
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-800">Google Gemini AI Engine</h4>
                  <p className="text-[11px] text-gray-500">
                    {healthStatus?.geminiConfigured
                      ? 'Configured (Active API Key)'
                      : 'Missing GEMINI_API_KEY in server/.env'}
                  </p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${
                    healthStatus?.geminiConfigured ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-800">Supabase PostgreSQL & Auth</h4>
                  <p className="text-[11px] text-gray-500">
                    {healthStatus?.supabaseConfigured
                      ? 'Connected with Row Level Security'
                      : 'Running in Local Memory / Demo Mode'}
                  </p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${
                    healthStatus?.supabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
