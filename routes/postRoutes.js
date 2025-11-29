// routes/posts.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  likePost,
  updatePost,
} from '../controllers/postController.js';

const router = express.Router();

router.use(protect);

// Get all posts
router.get('/', getPosts);

// Get single post
router.get('/:id', getPost);

// Create post
router.post('/', createPost);

// Update post
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

// Like a post
router.post('/:id/like', likePost);

export default router;
