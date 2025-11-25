import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import assetRouter from './routes/assetRoutes.js';

const app = express();

app.use(
  cors({
    // origin: process.env.CLIENT_ORIGIN,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`public`));

app.use('/api/sunday-school/users', userRouter);
app.use('/api/sunday-school/assets', assetRouter);

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

    // You want studentId, email, nationalID to return readable messages
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
