import express from 'express';
import { getMedicalDetails, updateMedicalDetails } from '../controllers/medicalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getMedicalDetails)
  .post(protect, updateMedicalDetails)
  .put(protect, updateMedicalDetails);

export default router;
