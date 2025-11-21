import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';

const app = express();

app.use(
  cors({
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

export default app;
