import { Router } from 'express';
import { config } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriGuide AI API is operational',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      geminiConfigured: Boolean(config.gemini.apiKey),
      supabaseConfigured: Boolean(config.supabase.url && (config.supabase.anonKey || config.supabase.serviceRoleKey)),
      weatherConfigured: Boolean(config.weather.apiKey)
    }
  });
});

export default router;
