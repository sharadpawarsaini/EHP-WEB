import express from 'express';
import { getMedicines, addMedicine, deleteMedicine, toggleMedicineStatus } from '../controllers/medicineController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getMedicines);
router.post('/', protect, addMedicine);
router.delete('/:id', protect, deleteMedicine);
router.patch('/:id/toggle', protect, toggleMedicineStatus);

export default router;
