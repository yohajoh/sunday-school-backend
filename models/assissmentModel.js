import mongoose from 'mongoose';

const assissmentSchema = new mongoose.Schema({
  studentId: { type: ObjectId, ref: 'User', required: true },
  assessmentDate: { type: Date, required: true },

  // Assessment Details
  type: {
    type: String,
    enum: ['quiz', 'test', 'assignment', 'participation'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },

  // Scores and Feedback
  score: { type: Number, min: 0, max: 100 },
  maxScore: { type: Number, default: 100 },
  grade: { type: String }, // A, B, C, etc.
  feedback: { type: String },

  // Category and Level
  category: { type: String }, // Bible, Prayer, etc.
  level: { type: String }, // Beginner, Intermediate, Advanced

  // Metadata
  assessedBy: { type: ObjectId, ref: 'User' }, // Teacher/admin who assessed

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Assissment = mongoose.model('Assissment', assissmentSchema);

// db.progress.createIndex({ studentId: 1 })
// db.progress.createIndex({ assessmentDate: -1 })
// db.progress.createIndex({ type: 1 })
// db.progress.createIndex({ category: 1 })

export default Assissment;
