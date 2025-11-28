import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Upload single image - FIXED VERSION
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('📤 Uploading file to Cloudinary:', req.file.originalname);

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary using upload method instead of upload_stream
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'sunday-school',
      upload_preset: 'sunday_school_preset',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' },
      ],
    });

    console.log('✅ Cloudinary upload successful:', result.public_id);

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('❌ Upload route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image: ' + error.message,
    });
  }
});

// Upload multiple images - FIXED VERSION
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    console.log(`📤 Uploading ${req.files.length} files to Cloudinary`);

    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64 for Cloudinary
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'sunday-school',
        upload_preset: 'sunday_school_preset',
      });

      return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images: ' + error.message,
    });
  }
});

// Delete image - IMPROVED VERSION
router.delete('/image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    console.log('🗑️ Deleting image:', publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log('✅ Image deleted successfully:', publicId);
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      console.warn('⚠️ Failed to delete image:', result);
      res.status(400).json({
        success: false,
        message:
          result.result === 'not found'
            ? 'Image not found'
            : 'Failed to delete image',
      });
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image: ' + error.message,
    });
  }
});

export default router;
