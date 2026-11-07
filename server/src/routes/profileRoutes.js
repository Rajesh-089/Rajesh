import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';
import { profileUpdateSchema } from '../schemas/validationSchemas.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getProfile);
router.put('/', validateBody(profileUpdateSchema), updateProfile);

export default router;
