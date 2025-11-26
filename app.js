import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import assetRouter from './routes/assetRoutes.js';
import testRouter from './routes/test_cloudinary.js';
import uploadRoutes from './routes/upload.js';
import postRoutes from './routes/posts.js';
// import { handleMulterError } from './middleware/upload.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);

if (process.env.NODE_ENV === 'development') {
  // Fixed typo: developement -> development
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

app.use('/api/sunday-school/users', userRouter);
app.use('/api/sunday-school/assets', assetRouter);
app.use('/api/sunday-school/test', testRouter);
app.use('/api/sunday-school/upload', uploadRoutes);
app.use('/api/sunday-school/posts', postRoutes);

// Add multer error handler
// app.use(handleMulterError);

// Rest of your error handling middleware...
app.use((err, req, res, next) => {
  let status = 500;
  let message = 'Server error';

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)[0].message;
  }

  // Duplicate key error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];

    if (field === 'studentId') {
      message = 'Student ID already exists';
    } else if (field === 'email') {
      message = 'Email already exists';
    } else if (field === 'nationalID') {
      message = 'National ID already exists';
    } else {
      message = `${field} already exists`;
    }
  }

  // Custom thrown errors
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
