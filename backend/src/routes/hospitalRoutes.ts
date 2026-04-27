import express from 'express';
import { getNearbyHospitals } from '../controllers/hospitalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/nearby', protect, getNearbyHospitals);

export default router;
