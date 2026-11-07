import { getLiveWeather, getWeatherForecast } from '../services/weatherService.js';

export async function getCurrentWeather(req, res, next) {
  try {
    const state = req.query.state || 'Karnataka';
    const district = req.query.district || 'Dharwad';

    const weather = await getLiveWeather({ district, state });

    res.status(200).json({
      success: true,
      message: 'Weather observations retrieved',
      data: weather
    });
  } catch (err) {
    next(err);
  }
}

export async function getForecast(req, res, next) {
  try {
    const state = req.query.state || 'Karnataka';
    const district = req.query.district || 'Dharwad';

    const forecast = await getWeatherForecast({ district, state });

    res.status(200).json({
      success: true,
      message: 'Weather forecast retrieved',
      data: forecast
    });
  } catch (err) {
    next(err);
  }
}
