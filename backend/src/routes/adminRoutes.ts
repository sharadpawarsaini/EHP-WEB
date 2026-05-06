import express from 'express';
import { 
  getStats, 
  getAllUsers, 
  getAllFeedback, 
  updateFeedbackStatus, 
  getAccessLogs, 
  deleteUser,
  createBroadcast,
  sendDirectMessage
} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id', updateFeedbackStatus);
router.get('/logs', getAccessLogs);
router.delete('/users/:id', deleteUser);
router.post('/broadcast', createBroadcast);
router.post('/message', sendDirectMessage);

export default router;
