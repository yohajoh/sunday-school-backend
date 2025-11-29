import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import {
  deleteImage,
  uploadImage,
  uploadImages,
} from '../controllers/uploadController.js';

const router = express.Router();

router.use(protect);

// Upload single image - FIXED VERSION
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images - FIXED VERSION
router.post('/images', upload.array('images', 10), uploadImages);

// Delete image - IMPROVED VERSION
router.delete('/image/:publicId', deleteImage);

export default router;
