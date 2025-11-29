import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCatagories,
  getGalleries,
  getGallery,
} from '../controllers/userGalleryController.js';

const router = express.Router();

router.use(protect);

// Get published galleries for users WITHOUT PAGINATION
router.get('/', getGalleries);

// Get user gallery categories - FIXED VERSION
router.get('/categories', getCatagories);

// Get single gallery image
router.get('/:id', getGallery);

export default router;
