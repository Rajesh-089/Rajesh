import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validateRequest.js';
import {
  cropAdvisoryRequestSchema,
  fertilizerAdvisoryRequestSchema,
  irrigationAdvisoryRequestSchema,
  pestDiseaseRequestSchema
} from '../schemas/validationSchemas.js';
import {
  createCropAdvisory,
  createFertilizerAdvisory,
  createIrrigationAdvisory,
  createPestDiseaseAdvisory,
  getAdvisoryHistory,
  getAdvisoryById,
  deleteAdvisory
} from '../controllers/advisoryController.js';

const router = Router();

router.use(requireAuth);

// Crop Advisory (AI generation protected by rate limiter)
router.post('/crop', aiRateLimiter, validateBody(cropAdvisoryRequestSchema), createCropAdvisory);

// Fertilizer Advisory
router.post('/fertilizer', aiRateLimiter, validateBody(fertilizerAdvisoryRequestSchema), createFertilizerAdvisory);

// Irrigation Advisory
router.post('/irrigation', aiRateLimiter, validateBody(irrigationAdvisoryRequestSchema), createIrrigationAdvisory);

// Pest & Disease Advisory
router.post('/pest-disease', aiRateLimiter, validateBody(pestDiseaseRequestSchema), createPestDiseaseAdvisory);

// History & management
router.get('/history', getAdvisoryHistory);
router.get('/:id', getAdvisoryById);
router.delete('/:id', deleteAdvisory);

export default router;
