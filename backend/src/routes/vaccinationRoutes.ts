import express from 'express';
import { getVaccinations, addVaccination, deleteVaccination } from '../controllers/vaccinationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getVaccinations);
router.post('/', protect, addVaccination);
router.delete('/:id', protect, deleteVaccination);

export default router;
