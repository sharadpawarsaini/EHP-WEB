import express from 'express';
import { 
  getStats, 
  getAllUsers, 
  getAllFeedback, 
  updateFeedbackStatus, 
  getAccessLogs, 
  deleteUser,
  createBroadcast,
  sendDirectMessage,
  getSystemSettings,
  updateSystemSettings,
  bulkUserActions,
  getCyberSecurityStats,
  getSecurityLogsFeed,
  getBlockedIPs,
  blockIP,
  unblockIP
} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post('/users/bulk-action', bulkUserActions);
router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id', updateFeedbackStatus);
router.get('/logs', getAccessLogs);
router.delete('/users/:id', deleteUser);
router.post('/broadcast', createBroadcast);
router.post('/message', sendDirectMessage);
router.get('/system-settings', getSystemSettings);
router.put('/system-settings', updateSystemSettings);

// Cyber Security Operations Center (SOC) Routes
router.get('/cyber/stats', getCyberSecurityStats);
router.get('/cyber/logs', getSecurityLogsFeed);
router.get('/cyber/blocked-ips', getBlockedIPs);
router.post('/cyber/block-ip', blockIP);
router.delete('/cyber/unblock-ip/:ip', unblockIP);

export default router;
