import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },

  // Personal Information
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  sex: { type: String, enum: ['male', 'female'], required: true },
  phoneNumber: { type: String, required: true },

  // Disability Information
  disability: { type: Boolean, default: false },
  disabilityType: { type: String },

  // Personal Details
  dateOfBirth: { type: Date, required: true },
  nationalId: { type: String, required: true, unique: true },
  occupation: { type: String },
  marriageStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    default: 'single',
  },

  // Location Information
  country: { type: String, default: 'Ethiopia' },
  region: { type: String, required: true },
  zone: { type: String },
  woreda: { type: String },
  church: { type: String, required: true }, // Where they serve/worship

  // Parent/Guardian Information
  parentStatus: {
    type: String,
    enum: ['both', 'mother', 'father', 'guardian'],
    required: true,
  },
  parentFullName: { type: String, required: true },
  parentEmail: { type: String },
  parentPhoneNumber: { type: String, required: true },

  // Account Management
  avatar: { type: String }, // URL to profile picture
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: { type: Date },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema, 'users');

// db.users.createIndex({ email: 1 }, { unique: true })
// db.users.createIndex({ studentId: 1 }, { unique: true })
// db.users.createIndex({ nationalId: 1 }, { unique: true })
// db.users.createIndex({ church: 1 })
// db.users.createIndex({ status: 1 })
// db.users.createIndex({ role: 1 })

export default User;
