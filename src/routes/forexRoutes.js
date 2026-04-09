import express from 'express';
import { getForexNews } from '../controllers/forexController.js';

const router = express.Router();

// GET /api/forex/news - Fetch forex news from NewsAPI
router.get('/news', getForexNews);

export default router;
