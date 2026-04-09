import express from 'express';
import { getGoldNews } from '../controllers/goldController.js';

const router = express.Router();

// GET /api/gold/news - Fetch gold & precious metals news from NewsAPI
router.get('/news', getGoldNews);

export default router;
