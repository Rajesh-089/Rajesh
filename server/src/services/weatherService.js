import axios from 'axios';
import { config } from '../config/env.js';

/**
 * Weather service abstraction providing agricultural weather data.
 * Checks for live provider credentials and returns structured observations.
 */
export async function getLiveWeather({ district, state }) {
  if (!config.weather.apiKey) {
    return {
      isLive: false,
      provider: 'none',
      location: `${district}, ${state}`,
      notice: 'Live weather API key (WEATHER_API_KEY) is not configured. Real-time atmospheric metrics unavailable.'
    };
  }

  try {
    const query = `${district},${state},IN`;
    const response = await axios.get(`${config.weather.baseUrl}/weather`, {
      params: {
        q: query,
        appid: config.weather.apiKey,
        units: 'metric'
      },
      timeout: 5000
    });

    const data = response.data;
    return {
      isLive: true,
      provider: 'OpenWeatherMap',
      location: data.name || `${district}, ${state}`,
      temperature: data.main?.temp,
      tempMin: data.main?.temp_min,
      tempMax: data.main?.temp_max,
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : 0, // convert m/s to km/h
      rainfall: data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0,
      weatherDescription: data.weather?.[0]?.description || 'Clear sky',
      observedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn(`Weather service query failed for ${district}, ${state}:`, err.message);
    return {
      isLive: false,
      provider: 'error_fallback',
      location: `${district}, ${state}`,
      notice: `Could not fetch live weather from provider (${err.message}).`
    };
  }
}

export async function getWeatherForecast({ district, state }) {
  if (!config.weather.apiKey) {
    return {
      isLive: false,
      provider: 'none',
      location: `${district}, ${state}`,
      forecast: [],
      notice: 'Weather forecast requires WEATHER_API_KEY in server/.env.'
    };
  }

  try {
    const query = `${district},${state},IN`;
    const response = await axios.get(`${config.weather.baseUrl}/forecast`, {
      params: {
        q: query,
        appid: config.weather.apiKey,
        units: 'metric'
      },
      timeout: 6000
    });

    const list = response.data.list || [];
    // Extract daily midday forecasts for up to 5 days
    const dailyForecasts = list
      .filter(item => item.dt_txt && item.dt_txt.includes('12:00:00'))
      .slice(0, 5)
      .map(item => ({
        date: item.dt_txt.split(' ')[0],
        temperature: item.main?.temp,
        humidity: item.main?.humidity,
        weatherDescription: item.weather?.[0]?.description,
        rainfallProbability: item.pop ? Math.round(item.pop * 100) : 0,
        rainVolumeMm: item.rain ? item.rain['3h'] || 0 : 0
      }));

    return {
      isLive: true,
      provider: 'OpenWeatherMap',
      location: response.data.city?.name || `${district}, ${state}`,
      forecast: dailyForecasts
    };
  } catch (err) {
    return {
      isLive: false,
      provider: 'error_fallback',
      location: `${district}, ${state}`,
      forecast: [],
      notice: `Forecast unavailable: ${err.message}`
    };
  }
}
