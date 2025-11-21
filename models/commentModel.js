import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: { type: ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true }, // Author's display name
  authorId: { type: ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },

  // Engagement
  likes: [{ type: ObjectId, ref: 'User' }], // Array of user IDs who liked

  // Threading (for nested comments)
  parentId: { type: ObjectId, ref: 'Comment' }, // For reply comments
  replies: [{ type: ObjectId, ref: 'Comment' }], // Array of reply comment IDs

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

// db.comments.createIndex({ postId: 1 })
// db.comments.createIndex({ authorId: 1 })
// db.comments.createIndex({ parentId: 1 })
// db.comments.createIndex({ createdAt: -1 })

export default Comment;
