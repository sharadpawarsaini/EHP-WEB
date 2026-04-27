import express from 'express';
import { getVitals, addVital, deleteVital } from '../controllers/vitalsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getVitals)
  .post(protect, addVital);

router.delete('/:id', protect, deleteVital);

export default router;
