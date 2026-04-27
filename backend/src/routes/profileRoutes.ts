import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getProfile)
  .post(protect, updateProfile)
  .put(protect, updateProfile);

export default router;
