import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile, updateProfilePhoto } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';
import { storage } from '../config/cloudinary';

const router = express.Router();

// Using Cloudinary Storage instead of Disk Storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.route('/')
  .get(protect, getProfile)
  .post(protect, updateProfile)
  .put(protect, updateProfile);

// The 'photoUrl' will now be a permanent Cloudinary URL
router.post('/photo', protect, upload.single('photo'), updateProfilePhoto);

export default router;
