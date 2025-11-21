import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String },

  // Session Details
  type: {
    type: String,
    enum: ['regular', 'special', 'event', 'holiday'],
    default: 'regular',
  },
  location: { type: String },
  teacherId: { type: ObjectId, ref: 'User' },

  // Attendance Tracking
  attendees: [
    {
      userId: { type: ObjectId, ref: 'User', required: true },
      status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true,
      },
      checkInTime: { type: Date },
      notes: { type: String },
    },
  ],

  // Materials and Resources
  materials: [{ type: String }], // Array of resource URLs
  lessonTopic: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// db.sessions.createIndex({ date: -1 })
// db.sessions.createIndex({ "attendees.userId": 1 })
// db.sessions.createIndex({ type: 1 })

export default Attendance;
