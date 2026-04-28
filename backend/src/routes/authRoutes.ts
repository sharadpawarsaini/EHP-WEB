import express from 'express';
import { registerUser, loginUser, logoutUser, updatePassword, deleteUserAccount } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update-password', protect, updatePassword);
router.delete('/delete-account', protect, deleteUserAccount);

export default router;
