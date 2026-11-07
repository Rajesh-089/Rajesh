import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  // Gemini AI
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  },

  // Weather Provider
  weather: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5'
  },

  // Security
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  }
};

/**
 * Validates configuration and logs non-blocking guidance for developers
 */
export function validateEnvironment() {
  const missing = [];
  if (!config.supabase.url) missing.push('SUPABASE_URL');
  if (!config.supabase.anonKey && !config.supabase.serviceRoleKey) missing.push('SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY');
  if (!config.gemini.apiKey) missing.push('GEMINI_API_KEY');

  if (missing.length > 0) {
    console.warn('\n⚠️  [AGRI-GUIDE AI CONFIGURATION NOTICE]');
    console.warn(`   The following environment variables are not yet configured in server/.env:`);
    missing.forEach(key => console.warn(`   - ${key}`));
    console.warn('   The application will start, but AI generation and Supabase Auth require these keys.');
    console.warn('   Refer to docs/setup.md for step-by-step instructions.\n');
  } else {
    console.log('✅ Environment configuration validated successfully.');
  }
}
