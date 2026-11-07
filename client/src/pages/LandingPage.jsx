import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  FlaskConical,
  Bug,
  BotMessageSquare,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-agri-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-forest-50/80 via-white to-agri-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 text-forest-800 text-xs font-bold uppercase tracking-wider border border-forest-200">
              <Sprout className="w-4 h-4 text-forest-600" />
              <span>Next-Generation AgriTech Decision Support</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              Make Smarter Farming Decisions with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-700 via-leaf to-emerald-600">
                AI Precision
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Empowering farmers across Indian states with soil-to-seed matching, tailored fertilizer schedules,
              weather-aware irrigation, and IPM pest diagnostics powered by Google Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/crop-advisory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-base shadow-lg shadow-forest-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Get Free Crop Advisory</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-base border border-gray-200 shadow-sm transition-all"
              >
                <span>Register Farm Account</span>
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" /> ICAR & FAO Soil Principles
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" /> English, ಕನ್ನಡ, हिन्दी Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" /> 100% Free for Smallholder Farmers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-forest-600 mb-2">
              Operational Workflow
            </h2>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              From Soil Sample to Harvest Strategy in 4 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Register Plot Profile',
                desc: 'Enter district, village, cultivable land area, and water source (borewell, canal, rainfed).'
              },
              {
                step: '02',
                title: 'Log Soil Health',
                desc: 'Input available soil pH and NPK test values, or select known regional soil texture.'
              },
              {
                step: '03',
                title: 'AI Analysis',
                desc: 'Gemini evaluates agro-climatic zone, season (Kharif/Rabi/Zaid), and atmospheric forecasts.'
              },
              {
                step: '04',
                title: 'Actionable Advisory',
                desc: 'Receive ranked crop recommendations, basal fertilizer split calculators, and IPM guides.'
              }
            ].map((item, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <div className="text-3xl font-black text-forest-600/30">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-leaf mb-2">
              Integrated Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Complete Agronomic Intelligence Suite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Crop Suitability AI</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ranked recommendations matched against soil NPK, pH reaction, regional rainfall patterns, and seasonal planting windows.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nutrient & NPK Schedulers</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Exact basal and split-dose fertilizer calculations tailored to prevent nitrogen leaching and reduce input expenses.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Weather & Irrigation Forecaster</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dynamic watering schedules integrated with 5-day precipitation forecasts to prevent crop water stress and conserve water.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pest & Disease Diagnostics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Symptom-based identification highlighting biological IPM solutions (Neem oil, Trichoderma) and WHO toxicity guidelines.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <BotMessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Krishi Chatbot</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Conversational assistant specialized in Indian agriculture, answering crop inquiries in English, Kannada, and Hindi.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Multi-Parcel Land Ledger</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Maintain multiple farm plots with chronological soil test records and historical advisory tracking with complete data isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Focus Banner */}
      <section className="py-12 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Tailored for Indian Agro-Climatic Conditions
          </h2>
          <p className="text-forest-200 max-w-2xl mx-auto text-sm">
            Optimized for major agricultural states including Karnataka, Maharashtra, Andhra Pradesh, Telangana, Tamil Nadu, and Punjab with localized seasonal planting calendars.
          </p>
          <div className="pt-2">
            <Link
              to="/crop-advisory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-leaf hover:bg-leaf-dark text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Explore Crop Advisory Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
