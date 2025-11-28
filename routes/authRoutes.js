// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ==================== PROTECTED ROUTES ====================

router.use(protect);
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.patch('/change-password', changePassword);

export default router;
