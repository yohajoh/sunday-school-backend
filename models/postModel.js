import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },

  // Author Information
  author: { type: String, required: true }, // Author's display name
  authorId: { type: ObjectId, ref: 'User', required: true },

  // Categorization
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

  // Scheduling
  publishDate: { type: Date, required: true },
  expiryDate: { type: Date },

  // Audience and Visibility
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents'],
    default: 'all',
  },
  isPinned: { type: Boolean, default: false },

  // Engagement Metrics
  likes: [{ type: ObjectId, ref: 'User' }], // Array of user IDs who liked
  shares: { type: Number, default: 0 },

  // Media and Metadata
  image: { type: String }, // Featured image URL
  tags: [{ type: String }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// db.posts.createIndex({ authorId: 1 })
// db.posts.createIndex({ category: 1 })
// db.posts.createIndex({ status: 1 })
// db.posts.createIndex({ targetAudience: 1 })
// db.posts.createIndex({ publishDate: -1 })
// db.posts.createIndex({ isPinned: -1, publishDate: -1 })

export default Post;
