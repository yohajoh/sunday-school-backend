import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

import app from './app.js';

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
