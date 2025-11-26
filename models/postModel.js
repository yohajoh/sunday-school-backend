import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['announcement', 'lesson', 'event', 'general'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    image: { type: String },
    imagePublicId: { type: String },
    tags: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'teachers', 'parents'],
      default: 'all',
    },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shares: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', postSchema);
