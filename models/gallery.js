import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    format: {
      type: String,
      required: true,
    },
    bytes: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: [
        'general',
        'events',
        'activities',
        'classes',
        'celebrations',
        'sports',
        'arts',
      ],
      default: 'general',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
gallerySchema.index({ category: 1, isPublished: 1, createdAt: -1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ uploadedBy: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
