import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Sprout, Globe, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isConfigured } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {!isConfigured && (
        <div className="bg-amber-500 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Demo / Local Mode Active. Connect your Supabase & Gemini credentials in server/.env to enable live persistence.</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-sm group-hover:bg-forest-700 transition-colors">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-forest-900 tracking-tight block leading-tight">
              AgriGuide <span className="text-leaf">AI</span>
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block uppercase tracking-wider font-semibold">
              Crop Advisory Assistant
            </span>
          </div>
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer font-medium text-gray-800 outline-none"
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* User Links */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-forest-700 hover:text-forest-800 px-3 py-1.5 rounded-lg hover:bg-forest-50 transition-colors"
              >
                {t('dashboard')}
              </Link>
              <div className="h-5 w-px bg-gray-200" />
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-forest-700 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                  {(profile?.full_name || user.email || 'F')[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{profile?.full_name || 'My Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-forest-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-forest-600 text-white hover:bg-forest-700 px-4 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-100 border-none text-xs rounded-md px-2 py-1 font-medium text-gray-800"
          >
            <option value="en">EN</option>
            <option value="kn">KN</option>
            <option value="hi">HI</option>
          </select>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-forest-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-forest-700"
              >
                {t('dashboard')}
              </Link>
              <Link
                to="/crop-advisory"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('cropAdvisory')}
              </Link>
              <Link
                to="/fertilizer-advisory"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('fertilizer')}
              </Link>
              <Link
                to="/irrigation-advisory"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('irrigation')}
              </Link>
              <Link
                to="/pest-disease"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('pestDisease')}
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('chatAssistant')}
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-gray-700"
              >
                {t('history')}
              </Link>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700"
                >
                  {profile?.full_name || 'My Profile'}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-red-600 font-semibold"
                >
                  {t('logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2 text-center text-sm font-medium bg-forest-600 text-white rounded-lg"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
