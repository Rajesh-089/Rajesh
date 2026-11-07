import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';
import { landSchema } from '../schemas/validationSchemas.js';
import {
  getLands,
  createLand,
  getLandById,
  updateLand,
  deleteLand
} from '../controllers/landController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getLands);
router.post('/', validateBody(landSchema), createLand);
router.get('/:id', getLandById);
router.put('/:id', validateBody(landSchema.partial()), updateLand);
router.delete('/:id', deleteLand);

export default router;
