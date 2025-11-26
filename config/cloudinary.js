import dotenv from 'dotenv';
dotenv.config();

import cloud from 'cloudinary';

const cloudinary = cloud.v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dupb54xio',
  api_key: process.env.CLOUDINARY_API_KEY || '448791237963482',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || 'hbXywpQcVN4yOtPWbItALKTqOvA',
});

console.log(
  '✅ Cloudinary configured with cloud_name:',
  cloudinary.config().cloud_name,
);

export default cloudinary;
