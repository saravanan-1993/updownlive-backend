import express from 'express';
import { getStockNews } from '../controllers/stockController.js';

const router = express.Router();

router.get('/news', getStockNews);

export default router;
