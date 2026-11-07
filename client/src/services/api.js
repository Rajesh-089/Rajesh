import axios from 'axios';
import { supabase } from './supabaseClient.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45s for deep AI reasoning
});

// Request interceptor to attach Supabase JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
    } catch (e) {
      console.warn('Unable to get auth session for request:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.message || error.message || 'An unexpected error occurred';
    const customError = new Error(message);
    customError.code = errorData?.error?.code || 'API_ERROR';
    customError.details = errorData?.error?.details || null;
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

// ==========================================
// API SERVICE METHODS
// ==========================================
export const api = {
  // Health
  checkHealth: () => apiClient.get('/health'),

  // Profile
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.put('/profile', data),

  // Lands
  getLands: () => apiClient.get('/lands'),
  getLandById: (id) => apiClient.get(`/lands/${id}`),
  createLand: (data) => apiClient.post('/lands', data),
  updateLand: (id, data) => apiClient.put(`/lands/${id}`, data),
  deleteLand: (id) => apiClient.delete(`/lands/${id}`),

  // Crop Catalogue
  getCrops: () => apiClient.get('/crops'),
  getCropById: (id) => apiClient.get(`/crops/${id}`),

  // Advisory Endpoints
  generateCropPlan: (data) => apiClient.post('/advisory/crop', data),
  generateFertilizerAdvice: (data) => apiClient.post('/advisory/fertilizer', data),
  generateIrrigationAdvice: (data) => apiClient.post('/advisory/irrigation', data),
  generatePestAdvice: (data) => apiClient.post('/advisory/pest-disease', data),
  getAdvisoryHistory: (params) => apiClient.get('/advisory/history', { params }),
  getAdvisoryById: (id) => apiClient.get(`/advisory/${id}`),
  deleteAdvisory: (id) => apiClient.delete(`/advisory/${id}`),

  // Chat
  sendMessage: (data) => apiClient.post('/chat', data),
  getChatHistory: (conversationId) => apiClient.get(`/chat/history/${conversationId}`),

  // Weather
  getCurrentWeather: (params) => apiClient.get('/weather/current', { params }),
  getForecast: (params) => apiClient.get('/weather/forecast', { params })
};
