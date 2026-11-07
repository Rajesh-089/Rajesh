import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient.js';
import { Sprout, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setError('');
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to send recovery email.');
    }
  };

  return (
    <div className="min-h-screen bg-agri-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-500">
          Enter your registered email to receive a password recovery link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Recovery Email Sent</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-gray-800">{email}</span>, you will receive instructions to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block text-xs font-bold text-forest-700 hover:text-forest-800 mt-2"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest-500 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Reset Link</span>
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-forest-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
