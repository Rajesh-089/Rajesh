import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../schemas/formSchemas.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Sprout, LogIn, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setSubmitting(true);
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setValue('email', 'farmer@agriguide.ai');
    setValue('password', 'password123');
    onSubmit({ email: 'farmer@agriguide.ai', password: 'password123' });
  };

  return (
    <div className="min-h-screen bg-agri-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Sign In to AgriGuide AI
        </h2>
        <p className="text-sm text-gray-500">
          Access your farm profiles, soil records, and crop recommendations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10">
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="farmer@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 text-sm outline-none transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-forest-700 hover:text-forest-800"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 text-sm outline-none transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo 1-Click Button */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-semibold text-xs border border-forest-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡ Quick Demo Login (Skip registration)</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-700 hover:text-forest-800">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
