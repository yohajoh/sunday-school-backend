// routes/test-cloudinary.js
import express from 'express';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Simple test route
router.get('/simple', (req, res) => {
  console.log('✅ Test route hit!');
  res.json({
    success: true,
    message: 'Test route is working!',
    timestamp: new Date().toISOString(),
    cloudName: cloudinary.config().cloud_name,
  });
});

// Cloudinary test
router.get('/cloudinary', async (req, res) => {
  try {
    console.log('Testing Cloudinary...');

    // Simple ping test
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: 'Cloudinary connected!',
      cloudName: cloudinary.config().cloud_name,
      ping: result,
    });
  } catch (error) {
    console.error('Cloudinary error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary failed',
      error: error.message,
    });
  }
});

export default router;
