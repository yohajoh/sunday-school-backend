// app.js - UPDATED CORS AND COOKIE CONFIG
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import uploadRoutes from './routes/upload.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import galleryRoutes from './routes/gallery.js';
import userGalleryRoutes from './routes/userGallery.js';

const app = express();

// CRITICAL: Configure trust proxy FIRST
// app.set('trust proxy', 1);

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    // origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

// Use routes
app.use('/api/sunday-school/users', userRoutes);
app.use('/api/sunday-school/auth', authRoutes);
app.use('/api/sunday-school/assets', assetRoutes);
app.use('/api/sunday-school/upload', uploadRoutes);
app.use('/api/sunday-school/posts', postRoutes);
app.use('/api/sunday-school/comments', commentRoutes);
app.use('/api/sunday-school/admin/gallery', galleryRoutes);
app.use('/api/sunday-school/user/gallery', userGalleryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  let status = 500;
  let message = 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)[0].message;
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];

    if (field === 'studentId') {
      message = 'Student ID already exists';
    } else if (field === 'email') {
      message = 'Email already exists';
    } else if (field === 'nationalId') {
      message = 'National ID already exists';
    } else {
      message = `${field} already exists`;
    }
  }

  if (err.status) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message: message,
  });
});

export default app;
