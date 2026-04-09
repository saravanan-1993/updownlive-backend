import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadNewsletterImages, uploadLogo } from '../config/cloudinary.js';

const router = express.Router();

// POST /api/upload/newsletter-images — upload multiple images for newsletter
router.post('/newsletter-images', protect, admin, (req, res) => {
  uploadNewsletterImages(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    const urls = (req.files || []).map(f => f.path);
    res.json({ success: true, urls });
  });
});

// POST /api/upload/logo — upload single logo image
router.post('/logo', protect, admin, (req, res) => {
  uploadLogo(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, url: req.file.path });
  });
});

export default router;
