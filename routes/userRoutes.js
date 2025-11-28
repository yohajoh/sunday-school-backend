// routes/userRoutes.js
import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes - only logged-in users can access

router.use(protect);
// Restrict to admin only for user management
router.use(restrictTo('admin'));

router.get('/', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
