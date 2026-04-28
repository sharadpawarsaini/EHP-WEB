import express from 'express';
import { getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAppointments);
router.post('/', protect, addAppointment);
router.patch('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, deleteAppointment);

export default router;
