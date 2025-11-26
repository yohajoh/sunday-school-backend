import express from 'express';
import Post from '../models/postModel.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('❌ Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
    });
  }
});

// Create post with image data from request body (NO file upload here)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      status,
      tags,
      targetAudience,
      isPinned,
      publishDate,
      expiryDate,
      authorId,
      image, // Image URL from frontend
      imagePublicId, // Public ID from frontend
    } = req.body;

    console.log('📝 Creating post with data:', {
      title,
      image,
      imagePublicId,
      authorId,
    });

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const post = new Post({
      title,
      content,
      author: 'System Admin', // You can get this from auth middleware
      authorId: authorId || '65d8f5a8c8e9f4a1b2c3d4e5', // Default or from auth
      category,
      status,
      image: image || '', // Use the image URL from request body
      imagePublicId: imagePublicId || '', // Use the publicId from request body
      tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
      targetAudience,
      isPinned: isPinned === 'true' || isPinned === true,
      publishDate: publishDate || new Date(),
      expiryDate: expiryDate || null,
    });

    await post.save();

    console.log('✅ Post created successfully:', post._id);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post: ' + error.message,
    });
  }
});

// Update post - also accept image data from request body
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const {
      title,
      content,
      category,
      status,
      tags,
      targetAudience,
      isPinned,
      publishDate,
      expiryDate,
      image, // New image URL from frontend
      imagePublicId, // New public ID from frontend
    } = req.body;

    console.log('📝 Updating post with data:', {
      title,
      image,
      imagePublicId,
    });

    // If new image data is provided, update it (and delete old image from Cloudinary)
    if (image && imagePublicId) {
      // Delete old image from Cloudinary if it exists and is different from new one
      if (post.imagePublicId && post.imagePublicId !== imagePublicId) {
        try {
          await cloudinary.uploader.destroy(post.imagePublicId);
          console.log(
            '🗑️ Deleted old image from Cloudinary:',
            post.imagePublicId,
          );
        } catch (deleteError) {
          console.error('❌ Error deleting old image:', deleteError);
          // Continue with update even if deletion fails
        }
      }

      post.image = image;
      post.imagePublicId = imagePublicId;
    }

    // Update other fields
    const updatableFields = [
      'title',
      'content',
      'category',
      'status',
      'tags',
      'targetAudience',
      'isPinned',
      'publishDate',
      'expiryDate',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'tags') {
          post[field] = Array.isArray(req.body[field])
            ? req.body[field]
            : JSON.parse(req.body[field]);
        } else if (field === 'isPinned') {
          post[field] = req.body[field] === 'true' || req.body[field] === true;
        } else {
          post[field] = req.body[field];
        }
      }
    });

    post.updatedAt = new Date();
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('❌ Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post: ' + error.message,
    });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Delete image from Cloudinary
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
        console.log('🗑️ Deleted image from Cloudinary:', post.imagePublicId);
      } catch (deleteError) {
        console.error('❌ Error deleting image from Cloudinary:', deleteError);
        // Continue with post deletion even if image deletion fails
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post: ' + error.message,
    });
  }
});

export default router;
