import express from 'express';
import { getNearbyFacilities } from '../controllers/hospitalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/nearby', protect, getNearbyFacilities);

export default router;
