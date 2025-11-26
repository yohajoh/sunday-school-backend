// routes/posts.js
import express from 'express';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'firstName lastName')
      .populate('likes', 'firstName lastName')
      .sort({ isPinned: -1, createdAt: -1 });

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

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'firstName lastName')
      .populate('likes', 'firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('❌ Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
    });
  }
});

// Create post
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
      image,
      imagePublicId,
    } = req.body;

    const post = new Post({
      title,
      content,
      author: 'System Admin',
      authorId: authorId || '65d8f5a8c8e9f4a1b2c3d4e5',
      category,
      status,
      image: image || '',
      imagePublicId: imagePublicId || '',
      tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
      targetAudience,
      isPinned: isPinned === 'true',
      publishDate: publishDate || new Date(),
      expiryDate,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'firstName lastName')
      .populate('likes', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post: ' + error.message,
    });
  }
});

// Update post
router.put('/:id', async (req, res) => {
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
      image,
      imagePublicId,
    } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        status,
        tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
        targetAudience,
        isPinned: isPinned === 'true',
        publishDate,
        expiryDate,
        image: image || '',
        imagePublicId: imagePublicId || '',
      },
      { new: true, runValidators: true },
    )
      .populate('authorId', 'firstName lastName')
      .populate('likes', 'firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

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

    // Delete all comments associated with this post
    await Comment.deleteMany({ postId: req.params.id });

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

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((like) => like.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate('authorId', 'firstName lastName')
      .populate('likes', 'firstName lastName');

    res.json({
      success: true,
      data: updatedPost,
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
    });
  } catch (error) {
    console.error('❌ Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post: ' + error.message,
    });
  }
});

export default router;
