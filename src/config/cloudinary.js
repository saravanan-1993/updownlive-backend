import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for newsletter images
export const newsletterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'updownlive/newsletter',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// Storage for general/logo images
export const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'updownlive/logo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

export const uploadNewsletterImages = multer({
  storage: newsletterStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array('images', 10);

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single('logo');

export default cloudinary;
