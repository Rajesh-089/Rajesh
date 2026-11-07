import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LandPage from './pages/LandPage.jsx';
import CropAdvisoryPage from './pages/CropAdvisoryPage.jsx';
import RecommendationDetailPage from './pages/RecommendationDetailPage.jsx';
import FertilizerPage from './pages/FertilizerPage.jsx';
import IrrigationPage from './pages/IrrigationPage.jsx';
import PestDiseasePage from './pages/PestDiseasePage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/land-details"
              element={
                <ProtectedRoute>
                  <LandPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-advisory"
              element={
                <ProtectedRoute>
                  <CropAdvisoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations/:id"
              element={
                <ProtectedRoute>
                  <RecommendationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fertilizer-advisory"
              element={
                <ProtectedRoute>
                  <FertilizerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/irrigation-advisory"
              element={
                <ProtectedRoute>
                  <IrrigationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pest-disease"
              element={
                <ProtectedRoute>
                  <PestDiseasePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <WeatherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
