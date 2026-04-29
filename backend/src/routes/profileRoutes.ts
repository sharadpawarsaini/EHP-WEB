import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getProfile, updateProfile, updateProfilePhoto } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

router.route('/')
  .get(protect, getProfile)
  .post(protect, updateProfile)
  .put(protect, updateProfile);

router.post('/photo', protect, upload.single('photo'), updateProfilePhoto);

export default router;
