import express from 'express';
import { getFamilyMembers, addFamilyMember, deleteFamilyMember } from '../controllers/familyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getFamilyMembers)
  .post(protect, addFamilyMember);

router.delete('/:id', protect, deleteFamilyMember);

export default router;
