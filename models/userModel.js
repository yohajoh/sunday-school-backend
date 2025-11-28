// models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
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
  church: { type: String, required: true },

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
  avatar: { type: String },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: { type: Date },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ==================== MIDDLEWARE ====================

// Password hashing middleware - runs before saving
userSchema.pre('save', async function (next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp middleware - runs before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== INSTANCE METHODS ====================

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      studentId: this.studentId,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
};

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
