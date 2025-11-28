import express from 'express';
import Gallery from '../models/gallery.js';
import {protect} from '../middleware/auth.js'

const router = express.Router();

router.use(protect)

// Get published galleries for users WITHOUT PAGINATION
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;

    let query = { isPublished: true };

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

    // COMPLETELY REMOVED PAGINATION - FETCH ALL PUBLISHED GALLERIES
    const galleries = await Gallery.find(query)
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    // NO .limit() - NO .skip() - NO PAGINATION AT ALL

    const total = galleries.length;

    res.json({
      success: true,
      galleries, // THIS NOW CONTAINS EVERY SINGLE PUBLISHED IMAGE
      total, // TOTAL COUNT OF ALL PUBLISHED IMAGES
    });
  } catch (error) {
    console.error('❌ Get user galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching galleries',
    });
  }
});

// Get user gallery categories - FIXED VERSION
router.get('/categories', async (req, res) => {
  try {
    console.log('🔍 Fetching user gallery categories...');

    // Method 1: Using aggregation (most reliable)
    const categories = await Gallery.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category' } },
      { $project: { _id: 0, name: '$_id' } },
      { $sort: { name: 1 } },
    ]);

    // Extract category names from aggregation result
    const categoryNames = categories
      .map((item) => item.name)
      .filter((name) => name);

    console.log('✅ Categories found:', categoryNames);

    res.json({
      success: true,
      categories: ['all', ...categoryNames],
    });
  } catch (error) {
    console.error('❌ Get user categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories: ' + error.message,
    });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.id,
      isPublished: true,
    }).populate('uploadedBy', 'firstName lastName');

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
    }

    res.json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error('❌ Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery image',
    });
  }
});

export default router;
