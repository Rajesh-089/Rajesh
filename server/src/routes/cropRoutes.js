import { Router } from 'express';
import { getAllCrops, getCropById } from '../services/cropService.js';

const router = Router();

// Publicly readable crop catalogue
router.get('/', async (req, res, next) => {
  try {
    const crops = await getAllCrops();
    res.status(200).json({
      success: true,
      message: 'Crop catalogue retrieved',
      data: crops
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const crop = await getCropById(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found in catalogue',
        error: { code: 'NOT_FOUND' }
      });
    }
    res.status(200).json({
      success: true,
      message: 'Crop details retrieved',
      data: crop
    });
  } catch (err) {
    next(err);
  }
});

export default router;
