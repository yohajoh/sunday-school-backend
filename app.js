import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
);

if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`public`));

app.get('/debug-check', async (req, res) => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  let data = [];
  try {
    data = await db.collection('users').find({}).toArray();
  } catch (e) {}

  res.json({ collections, usersData: data });
});

app.use('/api/sunday-school/users', userRouter);

export default app;
