import { Router } from 'express';
import { getCurrentWeather, getForecast } from '../controllers/weatherController.js';

const router = Router();

// Weather endpoints (can be read by authenticated or public viewers on dashboard)
router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);

export default router;
