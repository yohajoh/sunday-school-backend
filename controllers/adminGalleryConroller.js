import Gallery from '../models/gallery.js';
import cloudinary from 'cloudinary';

// Get all galleries WITHOUT pagination
export const getGalleries = async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Remove pagination - fetch ALL galleries
    const galleries = await Gallery.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    // Removed: .limit(limit) and .skip((page - 1) * limit)

    const total = galleries.length; // Now total is just the length of returned galleries

    res.json({
      success: true,
      galleries,
      total, // Return total count for statistics
    });
  } catch (error) {
    console.error('❌ Get galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching galleries',
    });
  }
};

// Upload gallery image
export const uploadGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { title, description, category, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    console.log('📤 Uploading to Cloudinary:', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'sunday-school',
      upload_preset: 'sunday_school_preset',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' },
      ],
    });

    console.log('✅ Cloudinary upload successful:', uploadResult.public_id);

    // Save to database
    const gallery = new Gallery({
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'general',
      tags: tags
        ? tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      // uploadedBy: req.user._id, // Make sure your auth middleware sets req.user
      uploadedBy: req.user._id, // Make sure your auth middleware sets req.user
    });

    await gallery.save();
    await gallery.populate('uploadedBy', 'firstName lastName email');

    console.log('✅ Gallery image saved to database:', gallery.title);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      gallery: {
        _id: gallery._id,
        title: gallery.title,
        description: gallery.description,
        imageUrl: gallery.imageUrl,
        publicId: gallery.publicId,
        format: gallery.format,
        bytes: gallery.bytes,
        width: gallery.width,
        height: gallery.height,
        category: gallery.category,
        tags: gallery.tags,
        isPublished: gallery.isPublished,
        uploadedBy: gallery.uploadedBy,
        createdAt: gallery.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Gallery upload error:', error);

    // Handle specific Cloudinary errors
    if (error.message.includes('File size too large')) {
      return res.status(400).json({
        success: false,
        message:
          'File size too large. Please upload an image smaller than 10MB.',
      });
    }

    if (error.message.includes('Invalid image file')) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid image file. Please upload a valid image (JPEG, PNG, GIF, WEBP).',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading image: ' + error.message,
    });
  }
};

// Delete gallery image
export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(gallery.publicId);
      console.log('✅ Cloudinary image deleted:', gallery.publicId);
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary delete error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    console.log('✅ Gallery image deleted from database:', gallery.title);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('❌ Gallery delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image: ' + error.message,
    });
  }
};

// Update gallery image details
export const updateGallery = async (req, res) => {
  try {
    const { title, description, category, tags, isPublished } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        description: description?.trim(),
        category,
        tags: tags
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        isPublished,
      },
      { new: true, runValidators: true },
    ).populate('uploadedBy', 'firstName lastName email');

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      gallery,
    });
  } catch (error) {
    console.error('❌ Gallery update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating image: ' + error.message,
    });
  }
};

// Get gallery categories
export const getCatagories = async (req, res) => {
  try {
    const categories = await Gallery.distinct('category');
    res.json({
      success: true,
      categories: ['all', ...categories],
    });
  } catch (error) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
    });
  }
};
