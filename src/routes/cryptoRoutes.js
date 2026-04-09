import express from 'express';
import { getCryptoNews } from '../controllers/cryptoController.js';

const router = express.Router();

// GET /api/crypto/news - Fetch cryptocurrency news from NewsAPI
router.get('/news', getCryptoNews);

export default router;
