// routes/comments.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createNewComment,
  getComment,
  likeComment,
} from '../controllers/commentConroller.js';

const router = express.Router();

router.use(protect);

// Get all comments for a post
router.get('/post/:postId', getComment);

// Create new comment
router.post('/', createNewComment);

// Like a comment
router.post('/:id/like', likeComment);

export default router;
