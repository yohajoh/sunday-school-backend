import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';
import {
  deleteGallery,
  getCatagories,
  getGalleries,
  updateGallery,
  uploadGallery,
} from '../controllers/adminGalleryConroller.js';
// import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Get all galleries WITHOUT pagination
router.get('/', getGalleries);

// Upload gallery image
router.post('/upload', upload.single('image'), uploadGallery);
// Delete gallery image
router.delete('/:id', deleteGallery);

// Update gallery image details
router.put('/:id', updateGallery);

// Get gallery categories
router.get('/categories/all', getCatagories);

export default router;
