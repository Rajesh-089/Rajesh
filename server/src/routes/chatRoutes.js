import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validateRequest.js';
import { chatRequestSchema } from '../schemas/validationSchemas.js';
import { handleChatMessage, getConversationHistory } from '../controllers/chatController.js';

const router = Router();

router.use(requireAuth);

router.post('/', aiRateLimiter, validateBody(chatRequestSchema), handleChatMessage);
router.get('/history/:conversationId', getConversationHistory);

export default router;
