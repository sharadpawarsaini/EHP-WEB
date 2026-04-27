import express from 'express';
import { 
  generateEmergencyLink, 
  getEmergencyLink, 
  getPublicEmergencyData, 
  verifyDoctorAccess,
  getContacts,
  addContact,
  deleteContact
} from '../controllers/emergencyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/link')
  .post(protect, generateEmergencyLink)
  .get(protect, getEmergencyLink);

router.route('/contacts')
  .get(protect, getContacts)
  .post(protect, addContact);
  
router.route('/contacts/:id')
  .delete(protect, deleteContact);

router.get('/public/:slug', getPublicEmergencyData);
router.post('/public/:slug/access', verifyDoctorAccess);

export default router;
